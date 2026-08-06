import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { upsertMember } from '@/lib/membership-store';

// Stripe webhook for Gallery Membership subscriptions (/q/join). Two
// event families, each doing a different job:
//   - checkout.session.completed — fires once, right when a new
//     member's first payment succeeds. Has customer_details inline
//     (no extra API call), so it's the fast path for the record + the
//     welcome email.
//   - customer.subscription.created|updated|deleted — the actual
//     subscription lifecycle, independent of how the subscription was
//     created. `created` re-syncs the same record as a backstop
//     (idempotent, no email — avoids double-welcoming); `updated`
//     flags only when status becomes something that needs attention
//     (past_due, unpaid, etc.) rather than emailing on every minor
//     Stripe-internal update; `deleted` records cancellation.
//
// Register this URL (https://<domain>/api/membership-webhook) in the
// Stripe Dashboard once deployed, subscribed to those four event
// types. Deliberately its OWN endpoint with its OWN signing secret
// (MEMBERSHIP_WEBHOOK_SECRET, not STRIPE_WEBHOOK_SECRET) rather than
// reusing the storefront webhook's — every Stripe Dashboard endpoint
// gets a distinct whsec_... secret regardless of what events it
// carries, and this repo already burned time on a test/live secret
// mismatch once (see the go-live notes on the storefront webhook);
// giving each endpoint its own unambiguous env var name rules that
// whole bug class out here.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  if (!process.env.STRIPE_SECRET_KEY || !process.env.MEMBERSHIP_WEBHOOK_SECRET || !signature) {
    console.error('Membership webhook: Stripe env vars not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.MEMBERSHIP_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Membership webhook: signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode === 'subscription' && session.subscription) {
      const email = session.customer_details?.email;
      const subscriptionId =
        typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

      if (email && customerId) {
        const name = session.customer_details?.name ?? null;
        const tier = session.metadata?.tier ?? 'unknown';

        await upsertMember({
          subscriptionId,
          customerId,
          email,
          name,
          tier,
          status: 'active',
          priceId: null,
          currentPeriodEnd: null,
          updatedAt: Date.now(),
        });
        await upsertMemberContact(email, name, tier, 'active').catch((err) =>
          console.error('Membership webhook: Resend contact upsert failed:', err),
        );
        await notifyMembership('New Gallery Member', email, name, tier, 'active').catch((err) =>
          console.error('Membership webhook: notification failed:', err),
        );
      } else {
        console.error('Membership webhook: completed session missing email/customer');
      }
    }
  }

  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object as Stripe.Subscription;
    await syncFromSubscription(stripe, subscription);
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const synced = await syncFromSubscription(stripe, subscription);
    if (synced && subscription.status !== 'active' && subscription.status !== 'trialing') {
      await notifyMembership(
        'Membership needs attention',
        synced.email,
        synced.name,
        synced.tier,
        subscription.status,
      ).catch((err) => console.error('Membership webhook: notification failed:', err));
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const synced = await syncFromSubscription(stripe, subscription);
    if (synced) {
      await notifyMembership('Membership canceled', synced.email, synced.name, synced.tier, 'canceled').catch(
        (err) => console.error('Membership webhook: notification failed:', err),
      );
    }
  }

  return NextResponse.json({ received: true });
}

// Shared by all three subscription.* events — re-derives the full
// current state from Stripe (subscription + its customer) and syncs
// it to Redis + Resend. Returns the resolved email/name/tier so
// callers can compose a notification without re-fetching, or null if
// there's no usable customer (deleted customer, no email on file).
async function syncFromSubscription(stripe: Stripe, subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;

  const email = customer.email;
  if (!email) return null;
  const name = customer.name ?? null;
  const tier = subscription.metadata?.tier ?? 'unknown';
  const item = subscription.items.data[0];
  const priceId = item?.price?.id ?? null;

  await upsertMember({
    subscriptionId: subscription.id,
    customerId,
    email,
    name,
    tier,
    status: subscription.status,
    priceId,
    // Lives on the subscription item, not the subscription itself, as
    // of this SDK's API version — see SubscriptionItem in the stripe
    // package's types.
    currentPeriodEnd: item?.current_period_end ?? null,
    updatedAt: Date.now(),
  });
  await upsertMemberContact(email, name, tier, subscription.status).catch((err) =>
    console.error('Membership webhook: Resend contact upsert failed:', err),
  );

  return { email, name, tier };
}

// Adds/updates the member as a Resend contact in the Membership
// segment, with tier + status as contact properties — separate from
// the Redis record above (that's the operational source of truth;
// this is the layer for actually emailing members later). Resend's
// create-contact isn't documented as an upsert, so this tries create
// first and falls back to update + an explicit segment add for a
// contact that already exists (e.g. someone who also signed up for
// the general mailing list).
async function upsertMemberContact(
  email: string,
  name: string | null,
  tier: string,
  status: string,
): Promise<void> {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_MEMBERSHIP_SEGMENT_ID) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const segmentId = process.env.RESEND_MEMBERSHIP_SEGMENT_ID;
  const properties = { tier, status };

  const { error } = await resend.contacts.create({
    email,
    firstName: name || undefined,
    unsubscribed: false,
    segments: [{ id: segmentId }],
    properties,
  });

  if (error) {
    await resend.contacts.update({ email, firstName: name || undefined, properties });
    await resend.contacts.segments.add({ email, segmentId });
  }
}

async function notifyMembership(
  subjectPrefix: string,
  email: string,
  name: string | null,
  tier: string,
  status: string,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.POSSIBILIA_FROM_EMAIL || 'FFA <onboarding@resend.dev>',
    to: process.env.POSSIBILIA_TO_EMAIL || 'olli@futureaesthetics.foundation',
    subject: `${subjectPrefix} — ${tier} (${name || email})`,
    text: `${subjectPrefix}

Name: ${name || '(not provided)'}
Email: ${email}
Tier: ${tier}
Status: ${status}`,
  });
}

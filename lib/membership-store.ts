import { Redis } from '@upstash/redis';

// Durable record of Gallery Membership subscribers, backed by the same
// Upstash Redis instance as lib/storefront-store.ts (same env vars,
// same REST-based client — no connection pooling to manage). Keyed by
// Stripe subscription ID rather than customer ID: it's the one
// identifier present on every event we care about (checkout.session.
// completed via session.subscription, customer.subscription.* via the
// object itself directly) and stays stable across status changes,
// unlike trying to diff/merge partial updates.
//
// This is the operational source of truth (current tier + status per
// member); Resend (see the webhook's upsertMemberContact) is the
// separate marketing/email layer — different jobs, both backed by the
// same webhook.

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export function isMembershipStoreConfigured(): boolean {
  return redis !== null;
}

export interface MemberRecord {
  subscriptionId: string;
  customerId: string;
  email: string;
  name: string | null;
  tier: string;
  status: string; // Stripe Subscription.status: active, past_due, canceled, etc.
  priceId: string | null;
  currentPeriodEnd: number | null; // unix seconds
  updatedAt: number; // unix ms
}

const memberKey = (subscriptionId: string) => `membership:sub:${subscriptionId}`;
const INDEX_KEY = 'membership:index';

// Full-snapshot upsert — every call (from checkout completion or any
// subscription.* event) passes the complete current state, so this is
// safe to call with webhook retries/out-of-order delivery without
// needing to merge partial fields.
export async function upsertMember(record: MemberRecord): Promise<void> {
  if (!redis) return;
  await Promise.all([
    redis.set(memberKey(record.subscriptionId), record),
    redis.sadd(INDEX_KEY, record.subscriptionId),
  ]);
}

export async function getAllMembers(): Promise<MemberRecord[]> {
  if (!redis) return [];
  const ids = await redis.smembers<string[]>(INDEX_KEY);
  if (!ids.length) return [];
  const records = await Promise.all(ids.map((id) => redis!.get<MemberRecord>(memberKey(id))));
  return records.filter((r): r is MemberRecord => r != null);
}

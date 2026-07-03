import { Redis } from '@upstash/redis';

// Live sold/reserved state for the storefront, backed by Upstash Redis
// (REST-based — no connection pooling to manage, works from both the
// Node checkout/webhook routes and this Server Component's render
// path). lib/storefront.ts stays the static catalog (titles, artists,
// prices); this is the one place that changes at runtime, driven by
// the Stripe webhook.
//
// Requires UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (see
// .env.example). Without them, reads return "no live state" (the page
// still renders using the static status in lib/storefront.ts) and
// writes are no-ops — but nothing can be safely sold without a real
// store, since nothing would durably record it. The checkout route
// refuses to start a purchase until this is configured.

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export function isStoreConfigured(): boolean {
  return redis !== null;
}

export interface LiveState {
  sold?: boolean;
  reserved?: boolean;
  unitsSold?: number;
}

const soldKey = (id: string) => `storefront:sold:${id}`;
const reservedKey = (id: string) => `storefront:reserved:${id}`;
const unitsKey = (id: string) => `storefront:units:${id}`;

// Small, bounded roster (a dozen-ish artworks) — a few round trips per
// page load is fine at this scale; worth a pipeline if the roster
// grows much larger.
export async function getLiveStates(ids: string[]): Promise<Record<string, LiveState>> {
  if (!redis) return {};
  const out: Record<string, LiveState> = {};
  await Promise.all(
    ids.map(async (id) => {
      const [sold, reserved, units] = await Promise.all([
        redis!.get<boolean>(soldKey(id)),
        redis!.get<boolean>(reservedKey(id)),
        redis!.get<number>(unitsKey(id)),
      ]);
      out[id] = { sold: !!sold, reserved: !!reserved, unitsSold: units ?? undefined };
    }),
  );
  return out;
}

// Reserves a 1-of-1 for `ttlSeconds` so two buyers can't both start
// checkout on the same piece at once. `nx` makes the set atomic (only
// succeeds if nobody holds the reservation already); returns false if
// it's already reserved or sold. Editions don't use this — see the
// checkout route for why.
export async function reserveArtwork(id: string, ttlSeconds: number): Promise<boolean> {
  if (!redis) return false;
  const alreadySold = await redis.get<boolean>(soldKey(id));
  if (alreadySold) return false;
  const result = await redis.set(reservedKey(id), true, { nx: true, ex: ttlSeconds });
  return result === 'OK';
}

// Releases a reservation without marking anything sold — for an
// abandoned or expired Checkout Session (see the webhook's
// checkout.session.expired handler).
export async function releaseReservation(id: string): Promise<void> {
  if (!redis) return;
  await redis.del(reservedKey(id));
}

export async function markSold(id: string): Promise<void> {
  if (!redis) return;
  await Promise.all([redis.set(soldKey(id), true), redis.del(reservedKey(id))]);
}

export async function incrementUnitsSold(id: string): Promise<number> {
  if (!redis) return 0;
  await redis.del(reservedKey(id));
  return redis.incr(unitsKey(id));
}

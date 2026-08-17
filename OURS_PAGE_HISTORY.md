# OURS page history

## Where the PREVIOUS (pre-event) OURS page lives

The page that ran at `/ours` up to and through the event — "The future
isn't fixed" copy, the format grid, and the guestlist / artwork-submission
/ sponsor cards — is preserved in full and still viewable:

- **Live (unlinked, noindexed):** https://futureaesthetics.foundation/ours/pre-event
- **Source file:** `app/ours/pre-event/page.tsx` (a verbatim copy of the
  old `app/ours/page.tsx`, with only the metadata changed to noindex)
- **Git history:** the original file's full history is on `app/ours/page.tsx`
  before 2026-08-17 — `git log --follow -- app/ours/page.tsx`

The forms on it still POST to `/api/ours`, so it functions exactly as it
did if you ever need to demo it.

## What replaced it

On 2026-08-17 `/ours` became the post-event recap (built at `/ours-next`
during development, then moved here): the OursHeader media well, the
six-slat louver wall (About the Event / Gallery / Ledgerworks built out;
Visions, Systems of Power, and The Future is OURS grayed out until
finished), the Constellation gallery with the storefront Buy flow, and
the evening's photography.

## Related

- The storefront/checkout subsystem on this page is shared with
  `/ours/collect` — catalog in `lib/storefront.ts`, live inventory in
  Upstash Redis, Stripe checkout via `/api/storefront-checkout`.
- Build brief for the shop: `storefront/OURS_Shop_ClaudeCode_Brief.md`.

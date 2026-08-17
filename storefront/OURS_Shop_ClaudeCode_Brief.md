# OURS Shop — Build Brief for Claude Code

*Hand this to Claude Code. It builds against the futureaesthetics.foundation codebase, consistent with the existing `/patrons/private` and `/patrons/corporate` pages. Reuse that styling/layout system.*

## Context
Foundation for Future Aesthetics (FFA), 501(c)(3), **EIN 93-2025231**. OURS is a one-night art exhibition on **Sunday, Aug 9, 2026**, Space LES, NYC. We're selling consigned artworks online during/around the event. Each work sells at the **artist sale price + a 20% charitable premium** (retained by FFA). FFA collects and remits NY sales tax. Some works are **NFTs** (need a buyer wallet address at checkout).

## Decisions needed from Olli before building
1. ~~Sales tax method~~ **RESOLVED → Stripe Tax.** Enable Stripe Tax, set the origin address, **add FFA's NY registration**, and assign a **product tax code per item** (physical art vs. NFT — NFT is a judgment call). Stripe auto-calculates + collects the correct NYC rate at checkout; **FFA still files/remits the NY return** (Stripe provides the report). Note ~0.5% Stripe Tax fee per taxed transaction.
2. ~~Route path~~ **RESOLVED → `/ours/collect`** (matches the program). Must be **unlisted/unlinked AND password-protected** until the event, easy to unpublish after. Interim password: `Br4dbury&V3rne`.
3. ~~Stripe account~~ **RESOLVED → FFA has a Stripe account.** Build in **test mode** first, then switch to live keys; confirm the Stripe Tax NY registration is added on it.
4. ~~Final artwork list~~ **RESOLVED → source of truth = the `Sales Log` tab in FFA's master workbook** (artwork · artist · For sale? · NFT? · artist price · +20% · image). Pull only rows where **For sale = Yes**.

## What to build
A single unlisted, **password-protected** page (`/ours/collect`) with:
- A **grid of artworks** — each card: image, title, artist, medium, **price (incl. 20% premium)**, and a Buy button.
- **Per-piece Stripe Checkout** (one Checkout Session per artwork; each is a 1-of-1 or limited edition).
- A **sold state** (grayed card + "Sold" badge) that updates during the live evening.
- **NFT handling:** required buyer **wallet address** field + email at checkout, with the confirmation line *"You'll receive written confirmation of this address before transfer."*
- **Premium disclosure** line in the page footer: *"Prices include a 20% charitable premium supporting FFA."*
- Easy **takedown** after the event (unpublish / feature-flag).

## Data model (per artwork)
```
id, slug
title, artistName, medium
artistPrice (USD)          // 100% goes to the artist
displayPrice (USD)         // artistPrice * 1.20, shown to buyer (pre-tax)
imageUrl
isNFT (bool)
nftChain, nftContract      // if isNFT
status: "available" | "reserved" | "sold"
stripePriceId / stripeProductId
```
Compute tax at checkout via Stripe Tax, not stored in displayPrice.

**Inventory rules (from the Sales Log tab):**
- Seed each piece's status from the Sales Log **Status** column (Available / Sold / Sold out); only **Available** pieces are buyable.
- **Giorgia Lupi — *02 Blue*** is an **edition of 5** (qty 5) — allow up to 5 purchases, then auto **Sold out**. All other pieces are 1-of-1.
- **RERO** is already **Sold** (in-kind) — show as sold or omit.
- **NFT** pieces: Mauricio (and any confirmed Web3-wall artists).

## Page / UX spec
- Match `/patrons/*` visual system (fonts, spacing, color).
- Grid → card → optional detail modal/page. Card shows image, title, artist, medium, price.
- **Buy** button → creates a Stripe Checkout Session server-side → redirects to Stripe-hosted checkout.
- Sold cards: badge + disabled button. Footer: the premium disclosure line.
- Success page: thank-you + "a receipt and (for NFTs) wallet confirmation will follow." Cancel page: back to grid.

## Stripe integration
- **Server-side Checkout Sessions** (never expose secret keys client-side; keys in env).
- One Product/Price per artwork (or price_data inline). Put `artworkId`, `artistName`, `isNFT` in Checkout **metadata**.
- **Sales tax:** use **Stripe Tax** (chosen). Ensure FFA's **NY registration** is added and a **product tax code** is set on every item (distinct code for NFTs). Stripe calculates + collects at checkout; FFA files/remits the return.
- **NFT works:** use Checkout **custom fields** to collect the **wallet address (required)**; email is already collected by Checkout. Show the confirmation-line copy.
- **Webhook** on `checkout.session.completed`: (a) mark the artwork **sold**, (b) write the sale to the log/DB (artwork, buyer email, amount, tax, wallet if NFT). This is what powers the live sold-state.
- Enable Stripe's **built-in email receipt** (we'll layer the formal quid-pro-quo disclosure receipt separately — see receipt template, WIP).

## Preventing double-sales of 1/1s (live night)
- On Buy click, optionally **reserve** the piece (status → "reserved" with a short TTL) so two people can't check out the same 1/1 at once; release on cancel/expiry, confirm on webhook.
- Simpler fallback: a **staffed checkout desk** runs purchases so inventory is controlled by a human. Recommend at least this for the evening.

## Admin / live ops
- A minimal **admin toggle** (or CMS field) to manually mark a piece sold/available (in case of in-person cash/other sales) and to hide the page post-event.

## Security & handoff checklist
- Test mode → verify full flow (incl. NFT wallet field + webhook mark-sold) → switch to live keys.
- Keys in env vars; webhook signing secret configured.
- Page noindex + unlinked + **password-gated** (`Br4dbury&V3rne`) until go-live.

## Acceptance criteria
1. Unlisted, password-gated `/ours/collect` renders the artwork grid in the site's style.
2. Each available piece completes a real Stripe Checkout (test mode), with NY tax applied.
3. NFT pieces require a wallet address and show the confirmation line.
4. On payment, the piece flips to **Sold** (webhook) and the sale is logged.
5. Footer shows the premium disclosure line.
6. Page can be taken down cleanly after Aug 9.

# Eucatastrophe page — handoff

A live `/eucatastrophe` page for the FFA site: a locked, search-engine-style
landing that opens onto one fully-worked, evidence-anchored optimistic scenario
(claims colour-coded already-real / frontier / to-build, each inspectable for its
receipts and red-team), closing with an "agency" step that points the reader at a
way to act. Built in the existing FFA design system. **No new dependencies.**

## Files

**Added**
- `app/eucatastrophe/page.tsx` — route + metadata (canonical `/eucatastrophe`).
- `components/eucatastrophe/EucatastropheTool.tsx` — `'use client'` component holding
  the whole interaction (landing → scenario → agency). All copy/data is inline near
  the top (`QUESTION`, `CLAIMS`, `AGENCY`).

**Changed**
- `components/SiteNav.tsx` — the `Eucatastrophe` initiative pill is now a live link
  to `/eucatastrophe` (was a dimmed, unlaunched entry).

## How it works
- Nav + footer come from the root layout automatically.
- Landing search field is intentionally **locked** to one question for now; the
  button reveals the pre-built result. Expanding to free input / a real backend is
  the next phase.
- Colours map onto existing tokens: already-real = `sage`, frontier = `leather`,
  to-build = `taupe`/`muted`. No palette additions.

## Run & verify (on this laptop)
```powershell
npm install        # only if deps aren't installed yet
npm run dev        # open http://localhost:3000/eucatastrophe
```
Check: the landing renders over the sage→cream wash with the nav on top; "Find the
good future" opens the scenario; clicking each coloured claim swaps the receipts
panel; "Here's what you could do" opens the agency intake (a pre-filled situation +
two five-level dials), and "Show me where I come in" reveals the ranked,
evidence-rated directions — each with a "Show the evidence" expander; "New search"
returns to the landing.

The agency step is a guided sim: one persona (an exhausted ER nurse), directions
pre-sorted strongest-evidence-first, with a candid "lower-leverage than it feels"
card pinned last. In the real build the dials + free text feed Claude and the
directions come back generated-and-cited the same way the scenario claims do.

Then confirm it compiles clean:
```powershell
npm run build
npm run lint
```

## Deploy (per the repo README)
- **Cloudflare Pages:** `npx @cloudflare/next-on-pages`, output `.vercel/output/static`,
  Node compatibility flag on.
- **Railway:** auto-detects Next.js; runs `npm run build` + `npm start`.
Deploy the way the site is currently hosted — this is just one new route, no config
or env changes required.

## Optional follow-ups (not done)
- Wire the homepage Eucatastrophe initiative card's "Read more" to `/eucatastrophe`.
- Swap the OG/hero image (currently `/images/contact.jpg`).
- When ready, unlock the search field and connect the real generation backend.

## Note on syncing this to the other laptop
These files live in the OneDrive-synced repo. If your other laptop shares the same
OneDrive account, they'll appear there automatically once sync completes — just open
the repo in Claude Code and run the verify steps above. If it doesn't share OneDrive,
commit and push (or copy these three files) and pull on the other machine.

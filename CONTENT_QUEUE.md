# Content queue

Everywhere on the rebuild that uses placeholder, original, or paraphrased copy instead of the
final text from the live site. Each item has a file path, the slot in question, and what to
fill in. Tick them off as you swap real content in.

Anywhere this list says "paste in your final copy," the source of truth is *your* version of
the copy — either what's on the live site today (which you own) or whatever you decide to
publish on the rebuild.

---

## A. Headline copy (paraphrased — needs your final wording)

- [ ] **Hero tagline** — `lib/content.ts` → `SITE.tagline`. Used on the home hero, mission
  section, and footer description. Currently a paraphrase of your mission statement; replace
  with your canonical wording.
- [ ] **Mission section body paragraph** — `components/sections/Mission.tsx`, the paragraph
  under the tagline. Original prose, written as a stand-in. Swap for your real "why" copy.
- [ ] **Magazine callout headline + body** — `components/sections/MagazineCallout.tsx`
  ("Help us launch the debut issue." + paragraph). Currently a stand-in describing the Issue 0
  contributor call. Replace with your live-site language.
- [ ] **Artists callout body** — `components/sections/ArtistsCallout.tsx`. Two paragraphs about
  AI imagery and the call for artists. Original prose; the live site has its own phrasing.
- [ ] **Possibilia hero + pillars** — `app/possibilia/page.tsx`. The page H1, intro paragraph,
  and the three "Fiction / Criticism & essays / Artwork" pillars are all original copy.
- [ ] **Resources page intro + submission guide** — `app/resources/page.tsx`. The page H1
  ("Essays, research, and guides."), intro paragraph, and the submission-guide block at the
  bottom are stand-ins.
- [ ] **Contact page intro + reasons-to-write list** — `app/contact/page.tsx`. The H1, intro,
  and the three `REASONS` items.
- [ ] **Donate page hero + tier blurbs + "other ways to give"** — `app/donate/page.tsx`. The
  H1, intro paragraph, the three `TIERS` (Reader / Patron / Founding sponsor) descriptions,
  and the three "Other ways to give" cards. None of these reflect your actual giving program —
  set tiers, amounts, and processor copy that match what you really offer.

## B. Story / article content (placeholder cards + stub article bodies)

- [ ] **Story 1 — "How to submit work to Possibilia Magazine"** — `lib/content.ts` →
  `STORIES[0]`. Date, author, and title are factual; the `excerpt` is paraphrased. Replace
  with your real excerpt and add the full article body in
  `app/resources/[slug]/page.tsx` (currently renders a stub paragraph).
- [ ] **Story 2 — "Manifesto: forging our future through optimistic science fiction"** —
  `lib/content.ts` → `STORIES[1]`. Same as above — excerpt is paraphrased, body is a stub.
- [ ] **Long-form article rendering** — Decide how to render article bodies. Options:
  inline JSX (fine for two articles), MDX (`@next/mdx`), or a CMS (Sanity, Contentful,
  Notion). Until then, every article shares the same stub body in
  `app/resources/[slug]/page.tsx`.

## C. Research area + project + initiative descriptions

These items use the **live site's titles** (factual labels) but **paraphrased blurbs**.
Replace each `blurb` with your own description.

- [ ] **Research areas (5)** — `lib/content.ts` → `RESEARCH_AREAS`. Titles unchanged; blurbs
  are paraphrased.
- [ ] **Initiatives (3)** — `lib/content.ts` → `INITIATIVES`. Possibilia / Industrial Garden /
  Designing the Future. Titles + status unchanged; `blurb` for each is original prose.
- [ ] **Projects (4)** — `lib/content.ts` → `PROJECTS`. Names match the live site
  (Silverstone, Kingsway, Smith Park, NYLN). No blurbs yet — add a `blurb` field if you want
  short descriptions on the project tiles, and consider a per-project page if you want to
  feature each one in depth.

## D. Image assets (none committed yet)

All image slots fall back to a gradient placeholder. Drop files into `public/images/` using
the filenames the code already references — see `public/images/README.md` for the full list:

- [ ] `story-submit.jpg`, `story-manifesto.jpg`
- [ ] `hero.jpg` (homepage hero — landscape, ~2400×1200)
- [ ] `possibilia-cover.jpg` (portrait, ~3:4), `possibilia-hero.jpg` (landscape, ~16:9)
- [ ] `project-silverstone.jpg`, `project-kingsway.jpg`, `project-smithpark.jpg`,
  `project-nyln.jpg` (square)
- [ ] `initiative-possibilia.jpg`, `initiative-garden.jpg`, `initiative-exhibitions.jpg`
  (~4:3)

### Pulling assets from your existing Wix site

Two paths:

**Fast (recommended):** open <https://www.futureaesthetics.foundation/> in Chrome, right-click
each image → "Save image as…" → save into `public/images/` using the filename above.

**Direct download (bypass right-click):** Wix serves assets from `static.wixstatic.com`. The
canonical URL pattern is:

```
https://static.wixstatic.com/media/{MEDIA_ID}~mv2.{ext}
```

Known asset IDs from the saved HTML:

| File / role             | Wix media ID                                              |
| ----------------------- | --------------------------------------------------------- |
| OG share / hero PNG     | `0d54cf_dccd4f29742b46d584c14710f3a32617`                 |
| Hero or feature image   | `0d54cf_3553a22a…` (full ID elided in the dump)           |
| Project tile (large)    | `0d54cf_93a317199…`                                       |
| Gallery thumbnails      | `0d54cf_52f66a8e`, `0d54cf_7f9ac843`, `0d54cf_8aa03edf`, `0d54cf_8c35315e`, `0d54cf_f65d6d36` |
| Small icon / badge      | `0d54cf_07f69ad0…`                                        |
| Blog thumbnail          | `0d54cf_5e597736…`                                        |

For any partial ID, view the live site, right-click the image, "Open image in new tab" — the
URL gives you the full ID. Save the original (drop everything from `/v1/fit/...` onward).

- [ ] **Logo SVG** — direct download:
  <https://static.wixstatic.com/shapes/0d54cf_399fc3400a9f4ed282f663042cde868c.svg>.
  Save to `public/images/logo.svg`, then replace the
  circle-placeholder span in `components/Header.tsx` and `components/Footer.tsx` with an
  `<Image src="/images/logo.svg" ... />`.
- [ ] **Favicon set** — `app/favicon.ico`, `app/icon.png` (32×32), `app/apple-icon.png`
  (180×180). Next.js picks these up automatically.
- [ ] **OG / social card** — add `app/opengraph-image.png` (1200×630) for link previews.

## E. External services to wire up

- [ ] **Contact form** — `app/contact/page.tsx`. Form `action` currently points at
  `https://formspree.io/f/your-form-id`. Replace with your real Formspree form ID, a Resend
  endpoint, or a Next.js Route Handler that sends mail.
- [ ] **Donation processor** — `app/donate/page.tsx`. Each tier links to
  `https://www.every.org/futureaesthetics`. Confirm that's the right URL — or swap to Stripe
  Payment Links, DonorBox, etc.
- [ ] **Twitter/X handle** — `lib/content.ts` → `SITE.twitter`. Confirm the link is
  current.
- [ ] **EIN / mailing address** — not on the rebuild yet. Likely belongs on Donate (for DAF
  grants) and Contact. Add to `lib/content.ts` once you have the canonical strings.

## F. Plumbing / production-readiness

- [ ] Run `npm install` and `npm run dev` to confirm the site builds locally.
- [ ] Choose a font: the rebuild uses a system serif fallback stack. To use Google Fonts,
  add `next/font/google` imports in `app/layout.tsx` and assign them to the `--font-serif`
  and `--font-sans` CSS variables already wired in `tailwind.config.ts`.
- [ ] Confirm color palette (`tailwind.config.ts`) against your brand colors. The current
  values are a paper/ink/accent set chosen to match an editorial feel.
- [ ] Set up analytics (Cloudflare Web Analytics, Plausible, or similar) — drop the script
  tag in `app/layout.tsx`.
- [ ] Add `robots.txt` and `sitemap.ts` in `app/` once the URL structure is final.
- [ ] Write a short "About" / "Team" page if you want one — there isn't one yet.
- [ ] Decide whether to add a newsletter signup (e.g. Buttondown, Substack embed, ConvertKit)
  on the homepage or footer.

## G. Deploy

- [ ] Pick host (Cloudflare Pages or Railway — both covered in `README.md`).
- [ ] Point `www.futureaesthetics.foundation` DNS at the new host once you're ready to cut
  over.
- [ ] Set up a staging URL first (e.g. `staging.futureaesthetics.foundation`) so you can
  preview before the swap.

# Image assets

Drop image files into this folder and reference them from `lib/content.ts` (or directly in
components) as `/images/<filename>`.

Filenames the site already references — replace any of these and they'll load automatically:

**Homepage**
- `hero.jpg` — homepage hero collage (landscape, ~16:9). The big rock-arch / cosmos image.
  Edit `components/sections/Hero.tsx` and replace `<HeroBackground />` with
  `<Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="object-cover" />`.
- `mission.jpg` — square collage on the right of the Mission panel.
- `possibilia-spread.jpg` — magazine photograph on the left of the Possibilia callout
  (the open-magazine shot). 4:3.
- `initiatives-hero.jpg` — full-bleed astronaut/desert image behind "Our Initiatives" header.
  Edit `components/sections/InitiativesHeader.tsx` and replace the gradient div with an
  `<Image>` similar to Hero.
- `initiative-possibilia.jpg`, `initiative-garden.jpg`, `initiative-exhibitions.jpg` —
  square collages in each initiative card.

**Other pages**
- `story-submit.jpg`, `story-manifesto.jpg` — story cards on `/resources`.
- `possibilia-hero.jpg` — Possibilia page hero (landscape, ~16:9).
- `project-silverstone.jpg`, `project-kingsway.jpg`, `project-smithpark.jpg`,
  `project-nyln.jpg` — square project tiles on the Possibilia page.

Until a file exists at the listed path, the `Placeholder` component renders a neutral gradient
with the alt text overlaid — so the layout stays intact while you gather assets.

## Logo / lettermark

Two pieces:

1. **Footer mark** — `logo.svg`. Download from
   <https://static.wixstatic.com/shapes/0d54cf_399fc3400a9f4ed282f663042cde868c.svg>.
   Then in `components/Footer.tsx` replace the `<span>` containing "ff" with
   `<Image src="/images/logo.svg" alt="FFA" width={48} height={40} />`.

2. **Hero lettermark** — `ff-mark.svg`. The huge "ff" overlapping the hero image is the same
   logo at scale. Save the same SVG as `ff-mark.svg`, then in
   `components/sections/Hero.tsx` replace the `<FfMark />` SVG body with an `<Image>`
   pointing at `/images/ff-mark.svg`.

## Favicons

Place `favicon.ico` in `app/` (Next.js picks it up automatically). For a full favicon set, add
`icon.png` (32×32 or 48×48) and `apple-icon.png` (180×180) in `app/`.

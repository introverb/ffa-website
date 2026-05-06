# Foundation for Future Aesthetics - website

A rebuild of [futureaesthetics.foundation](https://www.futureaesthetics.foundation/) in Next.js
14 (App Router) + TypeScript + Tailwind CSS.

## Quickstart

```powershell
npm install
npm run dev
```

Then open <http://localhost:3000>.

To build and run a production bundle locally:

```powershell
npm run build
npm start
```

## Project layout

```
app/                       # Next.js App Router pages
  layout.tsx               # Root layout - header, footer, fonts
  page.tsx                 # Home
  possibilia/page.tsx      # Magazine
  resources/page.tsx       # Essays + research index
  resources/[slug]/page.tsx# Individual article (stub)
  contact/page.tsx         # Contact form
  donate/page.tsx          # Donation tiers
  globals.css              # Tailwind layers + design tokens
components/
  Header.tsx               # Sticky nav
  Footer.tsx               # Site footer
  Placeholder.tsx          # Image slot - gradient fallback when file is missing
  sections/                # Homepage sections, one file each
lib/
  content.ts               # All editable copy in one place - change here, not in components
public/images/             # Drop image assets here (see /public/images/README.md)
tailwind.config.ts         # Design tokens (colors, fonts, max-widths)
```

## Editing content

Most copy lives in [`lib/content.ts`](./lib/content.ts):

- `SITE` - name, tagline, social
- `STORIES` - homepage + resources cards
- `RESEARCH_AREAS` - the numbered list
- `PROJECTS` - project tiles
- `INITIATIVES` - magazine / makerspace / exhibitions cards

Page-level copy (Possibilia, Donate, Contact) lives in each route's `page.tsx`.

## Adding images

Drop files into [`public/images/`](./public/images). The `Placeholder` component renders a
neutral gradient when a file is missing, so layout stays intact while you gather assets.
Filenames the site already references are listed in [`public/images/README.md`](./public/images/README.md).

For the logo, replace the circular placeholder in `components/Header.tsx` and
`components/Footer.tsx` with an `<Image>` pointing at `/images/logo.svg`.

## Wiring up real services

A few stubs need real endpoints/IDs:

- **Contact form** - `app/contact/page.tsx` posts to a Formspree URL by default. Replace the
  `action` with your Formspree form ID, a Resend API route, or a Next.js Route Handler.
- **Donate links** - `app/donate/page.tsx` links to `every.org/futureaesthetics`. Swap to
  Stripe Payment Links, DonorBox, or your processor of choice.
- **Twitter / X** - `lib/content.ts` has the `@possibiliamag` URL; update if it changes.

## Design tokens

Defined in [`tailwind.config.ts`](./tailwind.config.ts):

| Token       | Value      | Use                                        |
|-------------|------------|--------------------------------------------|
| `paper`     | `#fbf9f4`  | page background                            |
| `cream`     | `#f7f3ec`  | section accents (alternating bands)        |
| `ink`       | `#1a1a1a`  | body text and primary buttons              |
| `accent`    | `#7a5c3f`  | hover states, link emphasis                |
| `muted`     | `#6b6258`  | secondary text                             |
| `rule`      | `#d8cfc1`  | hairlines and borders                      |

Fonts: serif body via system fallback stack (Iowan / Palatino / Source Serif), sans for nav and
metadata. Swap in `next/font` Google Fonts in `app/layout.tsx` if you want a specific face - the
CSS variables `--font-serif` and `--font-sans` are already wired through `tailwind.config.ts`.

## Deploying

### Cloudflare Pages

Cloudflare Pages now supports Next.js via `@cloudflare/next-on-pages`:

```powershell
npm install --save-dev @cloudflare/next-on-pages
npx @cloudflare/next-on-pages
```

In the Pages dashboard set the build command to `npx @cloudflare/next-on-pages` and the build
output directory to `.vercel/output/static`. The Node compatibility flag should be enabled.

### Railway

Railway auto-detects Next.js. Connect this repo and Railway will run `npm run build` and
`npm start` on its own. Set the `PORT` env var if you customize it (Next.js reads `process.env.PORT`).

### Static export (no server)

If you don't need ISR or server actions, you can statically export. Add to `next.config.mjs`:

```js
const nextConfig = { output: 'export', images: { unoptimized: true } };
```

Then `npm run build` produces a fully static `out/` folder you can drop on any host.

## Legal

The site is a 501(c)(3) nonprofit project. The mission language and project names are the
foundation's own; everything else in this repo (layout, components, prose) is original to this
rebuild and you can edit freely.

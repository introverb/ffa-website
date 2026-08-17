import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // FFA palette. Nicknames in (parens) are for talking about the
      // colors; the token is what you type. Full reference: PALETTE.md.
      colors: {
        // Foundations — neutral structure. Pulled from the live Wix
        // site's CSS variables.
        paper: '#FFFFFF', // Gallery wall — page/panel backgrounds
        cream: '#F5EEE4', // Vellum — card fills
        taupe: '#D8D2C6', // Plaster — background bands
        ink: '#3B3A3A', // Charcoal — primary text
        muted: '#625F5B', // Graphite — secondary text
        sage: '#718676', // Terrarium — primary accent (CTAs, eyebrows)
        'sage-light': '#BDD6C3', // Greenhouse mist — form-success states
        dark: '#151414', // Blackout — footer, dark panels
        // Reading chair — warm dark brown for accent panels (Long Way
        // Home section titles, anywhere we want a saddle/leather
        // feeling that reads warmer than `dark` or the cool `ink`).
        leather: '#5A4632',
        rule: '#D8D2C6', // Plaster (alias) — hairline borders
        // Accent pair promoted from the static patron/sponsor briefs
        // (where they live as --orange and --gold CSS vars) into the
        // official palette, joining sage as the site's three accent
        // hues. First on-site use: the OURS Contributors group colors
        // (flare = artists, sage = speakers, horizon = installation).
        flare: '#E8651A', // Signal flare — orange accent (energy/art)
        horizon: '#7A9AAC', // Horizon line — slate blue (vision)
      },
      fontFamily: {
        // Body text - universal Helvetica/Arial system stack.
        sans: ['Helvetica', 'Arial', 'system-ui', 'sans-serif'],
        // Heading / display face. Per the original design spec this should
        // be Eurostile Next Pro Semibold; until that licensed file is dropped
        // in, `--font-display` resolves to Saira (loaded via next/font/google
        // in app/layout.tsx).
        // Named `heading` rather than `display` because Tailwind's `font-display`
        // class collides with the CSS `font-display` property in @apply.
        heading: [
          'var(--font-display)',
          '"Eurostile Next Pro"',
          '"Eurostile"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        // din-next-w01-light (geometric sans). Approximated with DIN-likes.
        meta: ['"DIN Next"', '"DIN Alternate"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Scale lifted from the Wix typography system (1.4 line-height across)
        eyebrow: ['12px', { lineHeight: '1.4', letterSpacing: '0.08em' }],
        body: ['16px', { lineHeight: '1.55' }],
        'body-lg': ['18px', { lineHeight: '1.5' }],
        h6: ['20px', { lineHeight: '1.4' }],
        h5: ['25px', { lineHeight: '1.3' }],
        h4: ['30px', { lineHeight: '1.25' }],
        h3: ['38px', { lineHeight: '1.2' }],
        'h3-lg': ['50px', { lineHeight: '1.15' }],
        h2: ['48px', { lineHeight: '1.1' }],
        'h2-lg': ['65px', { lineHeight: '1.05' }],
        h1: ['64px', { lineHeight: '1.05' }],
        'h1-lg': ['90px', { lineHeight: '1.02' }],
      },
      maxWidth: {
        prose: '60ch',
        wide: '1280px',
      },
    },
  },
  plugins: [],
};

export default config;

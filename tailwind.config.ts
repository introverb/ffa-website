import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Pulled from the live Wix site's CSS variables
        paper: '#FFFFFF',
        cream: '#F5EEE4',
        taupe: '#D8D2C6',
        ink: '#3B3A3A',
        muted: '#625F5B',
        sage: '#718676',
        'sage-light': '#BDD6C3',
        dark: '#151414',
        rule: '#D8D2C6',
      },
      fontFamily: {
        // Body text — universal Helvetica/Arial system stack.
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

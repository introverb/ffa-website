import { HONEYPOT_FIELD } from '@/lib/spam';

// Anti-bot honeypot. Renders an input that humans never see
// (positioned off-screen, marked aria-hidden, removed from the tab
// order, autoComplete disabled) but autofill-pattern bots happily fill
// in. The corresponding `app/api/*` routes drop any submission where
// this field has a value (see `lib/spam.ts`).
//
// Deliberately no `<label>` and a generic field name (HONEYPOT_FIELD,
// not "company"/"website"/etc.) — a human-readable label like "Company
// website" is exactly the kind of text browser/password-manager
// autofill keys off, and it did: it silently filled this field for a
// real buyer, dropping their submission with no error shown. The
// aria-hidden wrapper already keeps this invisible to screen readers,
// so no label is needed for accessibility either.
//
// Drop this component into every <form> on the site — it has no props
// and no behavior; it just exists in the DOM as bot bait.

export function HoneypotField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0"
    >
      <input
        type="text"
        name={HONEYPOT_FIELD}
        id={HONEYPOT_FIELD}
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  );
}

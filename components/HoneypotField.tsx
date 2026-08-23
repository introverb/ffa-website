import { FORM_TOKEN_FIELD, TOKEN_SCRIPT } from '@/lib/form-token';
import { FormGuardClient } from './FormGuardClient';

// Keep in step with HONEYPOT_FIELD in lib/spam.ts (not imported from
// there so this stays out of the Redis client's dependency graph).
const HONEYPOT_FIELD = 'hp_field';

// Anti-bot field set — two pieces, dropped into every <form> on the
// site (no props, no behaviour of its own):
//
//   1. Honeypot. An input humans never see (positioned off-screen,
//      aria-hidden, out of the tab order, autofill off) but
//      autofill-pattern bots happily fill in. Any value → the
//      submission is dropped (lib/spam.ts).
//
//      Deliberately no <label> and a generic field name (HONEYPOT_FIELD,
//      not "company"/"website"/etc.) — a human-readable label like
//      "Company website" is exactly what browser/password-manager
//      autofill keys off, and it did: it silently filled this field for
//      a real buyer, dropping their submission with no error shown.
//
//   2. Proof-of-browser token. A hidden input that only gets a value
//      from JavaScript running in a real page: an inline script fills it
//      the moment the server HTML parses (so even a lightning-fast human
//      submit carries it), and FormGuardClient fills it for forms that
//      are rendered client-side. Anything POSTing the scraped HTML
//      without running a browser — which is how the "Robertvaw wanted
//      to know your price" family arrives — sends it empty and is
//      dropped. The token also carries its issue time, so a submit
//      faster than a human could type is dropped too.

export function HoneypotField() {
  return (
    <>
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
      <input type="hidden" name={FORM_TOKEN_FIELD} autoComplete="off" />
      {/* fills every token input on the page at parse time */}
      <script dangerouslySetInnerHTML={{ __html: TOKEN_SCRIPT }} />
      <FormGuardClient />
    </>
  );
}

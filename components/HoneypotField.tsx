// Anti-bot honeypot. Renders an `<input name="company_website">` that
// humans never see (positioned off-screen, marked aria-hidden, removed
// from the tab order, autoComplete disabled) but autofill-pattern bots
// happily fill in. The corresponding `app/api/*` routes drop any
// submission where this field has a value (see `lib/spam.ts`).
//
// Drop this component into every <form> on the site — it has no props
// and no behavior; it just exists in the DOM as bot bait.

export function HoneypotField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0"
    >
      <label htmlFor="company_website">
        Company website (leave empty):
        <input
          type="text"
          name="company_website"
          id="company_website"
          autoComplete="off"
          tabIndex={-1}
        />
      </label>
    </div>
  );
}

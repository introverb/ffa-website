// Helpers around the GoatCounter script loaded in app/layout.tsx.
// The script attaches `window.goatcounter` after first interactive
// load, exposing a `count()` method for imperative events. We wrap
// it here so callers don't have to worry about the script not being
// loaded yet (no-ops cleanly) or about TypeScript types.

declare global {
  interface Window {
    goatcounter?: {
      count: (opts: {
        path: string;
        title?: string;
        event?: boolean;
      }) => void;
    };
  }
}

// Fire a custom GoatCounter event. Use a colon-prefixed name to
// match the rest of the site's event taxonomy ("submit:contact",
// "scroll:support:partner-visible", etc.). No-ops on the server
// (where window is undefined) and before the GoatCounter script
// has loaded.
export function trackEvent(eventName: string, title?: string): void {
  if (typeof window === 'undefined') return;
  const gc = window.goatcounter;
  if (!gc || typeof gc.count !== 'function') return;
  gc.count({
    path: eventName,
    title: title ?? eventName,
    event: true,
  });
}

// Convert a human-readable string to a URL-safe lowercase slug —
// "Refer a donor or foundation" -> "refer-a-donor-or-foundation".
// Used to compose per-topic event names like
// `submit:contact:refer-a-donor-or-foundation` without dragging
// spaces or punctuation into the GoatCounter dashboard.
export function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

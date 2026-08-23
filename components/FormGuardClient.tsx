'use client';

import { useEffect } from 'react';
import { FORM_TOKEN_FIELD, makeFormToken } from '@/lib/form-token';

// Client half of the proof-of-browser token (see lib/spam.ts). The
// inline script in <HoneypotField /> fills the token the instant the
// server-rendered HTML parses; this effect covers forms that are
// rendered client-side after the fact (the FormDialog modals), where
// no inline script runs, and refreshes the stamp on every mount.
export function FormGuardClient() {
  useEffect(() => {
    document
      .querySelectorAll<HTMLInputElement>(`input[name="${FORM_TOKEN_FIELD}"]`)
      .forEach((el) => {
        if (!el.value) el.value = makeFormToken(Date.now());
      });
  }, []);
  return null;
}

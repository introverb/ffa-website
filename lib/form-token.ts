// The proof-of-browser form token — the client-safe half of lib/spam.ts,
// kept dependency-free so the components that render it (HoneypotField,
// FormGuardClient — which end up in client bundles) don't drag the Redis
// client in with them. Validation lives in lib/spam.ts.

export const FORM_TOKEN_FIELD = 'fg_token';

// `${ts}.${sig}` where sig is a cheap checksum of ts. Mirrored verbatim
// in TOKEN_SCRIPT below — keep the two in step.
export function makeFormToken(ts: number): string {
  return `${ts}.${(((ts % 9973) * 31 + 7) % 46656).toString(36)}`;
}

// The inline script HoneypotField injects. Fills every token input on
// the page the moment it parses — no waiting for hydration.
export const TOKEN_SCRIPT =
  `(function(){try{var t=Date.now(),s=(((t%9973)*31+7)%46656).toString(36);` +
  `var a=document.querySelectorAll('input[name="${FORM_TOKEN_FIELD}"]');` +
  `for(var i=0;i<a.length;i++){if(!a[i].value)a[i].value=t+"."+s;}}catch(e){}})();`;

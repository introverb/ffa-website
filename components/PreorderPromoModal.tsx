'use client';

import { useEffect, useState } from 'react';
import { FormDialog } from './FormDialog';

// Entry promo for the Possibilia Issue 0 preorder — shown once per
// browser session on the homepage, not on every page (sessionStorage,
// not localStorage: the offer is time-limited, so a return visit next
// week should still surface it, but navigating around the site in one
// sitting shouldn't). A short delay before opening lets the homepage
// itself paint first, so the modal doesn't flash in ahead of the page
// it's sitting on top of.
const DISMISSED_KEY = 'ffa:preorder-promo-dismissed';
// The pre-order interstitial, not Artizen directly: it walks the buyer
// through the Rewards section and warns that the big support bar mints
// an artifact rather than the magazine. Every other preorder affordance
// on the site points at this same path.
const PREORDER_URL = '/possibilia-preorder';
const OPEN_DELAY_MS = 700;

export function PreorderPromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY)) return;
    const t = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setOpen(false);
    sessionStorage.setItem(DISMISSED_KEY, '1');
  }

  return (
    <FormDialog open={open} onClose={close} title="Possibilia, Issue 0 — preorder the print magazine.">
      <p className="text-body leading-relaxed text-ink/80">
        Possibilia is a print magazine of optimistic, realistic science fiction; nonfiction
        companion pieces by field and industry experts; and commissioned original artwork.
        Issue 0 is available to preorder now.
      </p>
      <p className="mt-4 text-body leading-relaxed text-ink/80">
        Preorders run through Artizen: on the page, collect the{' '}
        <strong className="font-heading">Possibilia Reward for $20</strong> to reserve your copy.
      </p>
      <a
        href={PREORDER_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={close}
        data-goatcounter-click="possibilia:preorder-promo-modal"
        className="btn-solid mt-8 inline-flex bg-flare px-8 py-3.5 text-base"
      >
        Preorder Issue 0 &mdash; $20
      </a>
      <p className="mt-3 text-xs text-muted">Opens in a new tab.</p>
    </FormDialog>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FormDialog } from './FormDialog';

// Entry promo for the Possibilia Issue 0 preorder — shown once per
// browser session on the homepage, not on every page (sessionStorage,
// not localStorage: the offer is time-limited, so a return visit next
// week should still surface it, but navigating around the site in one
// sitting shouldn't). A short delay before opening lets the homepage
// itself paint first, so the modal doesn't flash in ahead of the page
// it's sitting on top of.
const DISMISSED_KEY = 'ffa:preorder-promo-dismissed';
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
    <FormDialog open={open} onClose={close} title="The first 50 orders get something extra.">
      <p className="text-body leading-relaxed text-ink/80">
        Preorder Possibilia Issue 0 now and you&rsquo;ll receive an exclusive short story
        &mdash; one that never made it into the printed issue &mdash; available only to the
        first 50 collectors.
      </p>
      <Link
        href="/possibilia-preorder"
        onClick={close}
        data-goatcounter-click="possibilia:preorder-promo-modal"
        className="btn-solid mt-8 inline-flex bg-flare px-8 py-3.5 text-base"
      >
        Preorder Issue 0 &mdash; $20
      </Link>
    </FormDialog>
  );
}

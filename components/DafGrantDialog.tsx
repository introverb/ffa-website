'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FormDialog } from './FormDialog';

// Foundation legal record — what a DAF sponsoring organization needs
// from a nonprofit to process a grant recommendation. Same source of
// truth as the IRS determination letter / 990 filing.
const FFA_LEGAL_NAME = 'Foundation for Future Aesthetics';
const FFA_EIN = '93-2025231';
const FFA_MAILING = '200 Prospect Park W, Brooklyn, NY 11215';

// Base every.org donate URL. When the user's DAF is one of every.org's
// integrated sponsors (Fidelity Charitable, Schwab Charitable, etc.),
// every.org surfaces DAF as a payment method on this page and the
// grant flows through without a separate portal trip. If the donor's
// DAF isn't integrated, they fall back to the EIN + mailing + name
// fields above for manual entry into their DAF's grant-rec form.
const FFA_EVERY_ORG_DONATE =
  'https://www.every.org/foundation-for-future-aesthetics/donate';

// Standard "two overlapping squares" copy icon. Stroke-only so the
// parent's text color drives the icon color.
function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      width="10"
      height="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 8.5L8.5 3.5" />
      <path d="M4.5 3.5H8.5V7.5" />
    </svg>
  );
}

// One row in the grant-info modal: labeled field + copy-to-clipboard
// button on the right. Each row owns its own "copied" state so the
// checkmark affordance fires independently per field.
function GrantField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // navigator.clipboard fails on insecure contexts or older
      // browsers. The value is on screen for manual copy, so we
      // silently fall back to that.
    }
  }

  return (
    <div className="rounded-xl border border-ink/15 bg-cream p-4">
      <p className="text-eyebrow text-muted">{label}</p>
      <div className="mt-2 flex items-start gap-3">
        <p className="flex-1 break-words text-sm text-ink">{value}</p>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? `${label} copied` : `Copy ${label}`}
          title={copied ? 'Copied' : 'Copy'}
          className="shrink-0 rounded-md p-1.5 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
}

// Inline-link trigger that opens a modal with FFA's grant-info fields
// (legal name, EIN, mailing address) plus a one-click "Grant via
// every.org" button for donors whose DAF is integrated there. Used
// inline in the Donor-advised funds blurb on /support — same visual
// pattern as the Sablier/Superfluid inline links in the Stock &
// crypto blurb.
//
// Children are rendered as the link label, so the consumer chooses
// the trigger copy ("Open our grant info", "Get the details", etc.).
export function DafGrantDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-goatcounter-click="daf:open-info"
        className="underline decoration-from-font underline-offset-4 text-ink transition-colors hover:text-sage"
      >
        {children}
      </button>

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Grant from a DAF"
      >
        <p className="text-body leading-relaxed text-ink/80">
          Recommend a grant to FFA from your donor-advised fund. Paste the
          fields below into your DAF sponsor&rsquo;s grant-recommendation form
          (Fidelity Charitable, Schwab Charitable, Vanguard Charitable, and
          most others use the same three fields).
        </p>

        <div className="mt-6 space-y-3">
          <GrantField label="Legal name" value={FFA_LEGAL_NAME} />
          <GrantField label="EIN" value={FFA_EIN} />
          <GrantField label="Mailing address" value={FFA_MAILING} />
        </div>

        {/* One-click path — when the donor's DAF sponsor is one of
            every.org's integrated partners, they can grant directly
            through every.org without leaving for a separate portal.
            Falls back to the universal manual-entry path above for
            non-integrated DAFs. */}
        <div className="mt-6 rounded-xl border border-ink/15 p-4">
          <p className="text-eyebrow text-muted">Or, one-click path</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            If your DAF is at Fidelity Charitable, Schwab Charitable, Vanguard
            Charitable, or one of every.org&rsquo;s other integrated sponsors,
            you can grant directly through every.org — no portal trip needed.
          </p>
          <a
            href={FFA_EVERY_ORG_DONATE}
            target="_blank"
            rel="noopener noreferrer"
            data-goatcounter-click="daf:every-org"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sage px-4 py-2.5 text-xs uppercase tracking-[0.08em] text-white transition-colors hover:bg-dark"
          >
            Grant via every.org
            <ExternalIcon />
          </a>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-ink/75">
          <strong>For your tax records:</strong> after recommending the grant,
          drop us a note through{' '}
          <Link
            href="/contact?topic=Donor-advised fund grant"
            onClick={() => setOpen(false)}
            className="underline decoration-dotted decoration-from-font underline-offset-[3px] transition-colors hover:decoration-solid hover:text-sage"
          >
            the contact form
          </Link>{' '}
          so we can send the acknowledgment letter.
        </p>
      </FormDialog>
    </>
  );
}

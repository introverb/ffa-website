'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { FormDialog } from './FormDialog';

// FFA's on-chain donation wallet (Ledger-secured ETH account).
// Same address receives ETH and any ERC-20 token (USDC, DAI, etc.)
// since it's a standard Ethereum mainnet address. When/if FFA opens
// a Solana account, we'll surface that as a separate row below.
const FFA_ETH_ADDRESS = '0x54ce4Cf841ef47ed0773B0c197aceFCFc076cec7';

// Standard "two overlapping squares" copy icon (Lucide-style).
// Inherits stroke from currentColor so the parent's text color
// drives the icon color.
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

// Checkmark for the brief "copied!" affordance after a successful copy.
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

// Diagonal arrow-out-of-box — signals "this leaves the site" for the
// streaming protocol buttons (Superfluid, Sablier) which open in a
// new tab.
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

// Canonical Ethereum octahedron mark, faces colored to match the
// official brand illustration: peach/coral on the cool-warm top-left
// pair, mint on the upper-right outer face, periwinkle inside-left,
// lavender inside-right and bottom-right. Six paths total = the
// classic faceted 3D look in palette form.
function EthMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 33 53"
      aria-hidden="true"
      className={className}
    >
      {/* Top-right outer face — mint */}
      <path
        fill="#BFF0E5"
        d="M16.3576 0L16 1.21412V36.4764L16.3576 36.8336L32.7152 27.1396L16.3576 0Z"
      />
      {/* Top-left outer face — peach */}
      <path
        fill="#F0C4A8"
        d="M16.3578 0L0 27.1396L16.3578 36.8338V19.7194V0Z"
      />
      {/* Bottom-right outer face — lavender */}
      <path
        fill="#C8B5F2"
        d="M16.3576 39.9223L16.1554 40.1693V52.7269L16.3576 53.319L32.7232 30.2333L16.3576 39.9223Z"
      />
      {/* Bottom-left outer face — peach (mirrors top-left) */}
      <path
        fill="#F0C4A8"
        d="M16.3578 53.319V39.9223L0 30.2333L16.3578 53.319Z"
      />
      {/* Middle-right inner face — lavender */}
      <path
        fill="#C8B5F2"
        d="M16.3574 36.8334L32.7148 27.1394L16.3574 19.7191V36.8334Z"
      />
      {/* Middle-left inner face — periwinkle */}
      <path
        fill="#98AEE8"
        d="M0 27.1394L16.3576 36.8334V19.7191L0 27.1394Z"
      />
    </svg>
  );
}

// Client component that renders a "Give in ETH" pill on each Support
// tier. Click opens a portal-mounted modal showing the FFA wallet
// address with a QR code and a copy-to-clipboard control. Each tier
// passes its tier-specific label (e.g. "Give 0.13 ETH") so the
// button reads as a sized suggestion; inside the modal the donor
// chooses the actual amount they send from their wallet.
export function EthGiveButton({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(FFA_ETH_ADDRESS);
      setCopied(true);
      // Reset the "Copied!" affordance after two beats so a second
      // copy still feels responsive.
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // navigator.clipboard can fail on insecure contexts or older
      // browsers. The address is already on screen for manual copy,
      // so we silently fall back to that.
    }
  }

  return (
    <>
      {/* ETH button: gradient pulled from the same palette as the
          octahedron mark (peach → mint → periwinkle → lavender), with
          a frosted paper veil on top so the colors read as a muted
          "stained glass" rather than a loud rainbow. backdrop-blur
          softens the gradient transitions further. Content sits
          above the veil via a relative span. Hover thins the veil
          slightly to let more color through. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative inline-flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-xl px-3 py-3 text-xs uppercase tracking-[0.08em] text-ink transition-colors"
        style={{
          backgroundImage:
            'linear-gradient(135deg, #F0C4A8 0%, #BFF0E5 35%, #98AEE8 70%, #C8B5F2 100%)',
        }}
      >
        {/* Frost span gets its own rounded-xl to self-clip — some
            browsers leak backdrop-filter past the parent's
            overflow:hidden+rounded clip, which reads as squared
            corners. Matching the radius here forces a clean curve. */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-xl bg-paper/55 backdrop-blur-[3px] transition-colors group-hover:bg-paper/35"
        />
        <span className="relative inline-flex items-center gap-1.5">
          <EthMark className="h-3.5 w-auto shrink-0" />
          {label}
        </span>
      </button>

      <FormDialog open={open} onClose={() => setOpen(false)} title="Give in ETH">
        <p className="text-body leading-relaxed text-ink/80">
          Send any amount of ETH (or any ERC-20 token like USDC) to the wallet
          address below. The Foundation for Future Aesthetics is a registered
          501(c)(3); your donation is tax-deductible.
        </p>

        {/* Address card. The address is monospace + break-all so each
            character reads unambiguously and the line wraps cleanly
            inside the modal at any width. The compact copy/check icon
            sits at the right of the address row — small enough that
            the whole modal fits without scrolling. The icon swaps to
            a checkmark for two beats after a successful copy. */}
        <div className="mt-6 rounded-xl border border-ink/15 bg-cream p-4">
          <p className="text-eyebrow text-muted">FFA wallet address</p>
          <div className="mt-2 flex items-start gap-3">
            <p className="flex-1 break-all font-mono text-sm text-ink">
              {FFA_ETH_ADDRESS}
            </p>
            <button
              type="button"
              onClick={copyAddress}
              aria-label={copied ? 'Address copied' : 'Copy address'}
              title={copied ? 'Copied' : 'Copy'}
              className="shrink-0 rounded-md p-1.5 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>

        {/* QR encodes the bare address (no amount), so any wallet's QR
            scanner opens with the recipient pre-filled and the donor
            enters their amount. White background + small margin keeps
            it scannable on any modal background. Sized so the whole
            modal fits in viewport without scrolling. */}
        <div className="mt-5 flex justify-center">
          <div className="rounded-lg bg-white p-3">
            <QRCodeSVG value={FFA_ETH_ADDRESS} size={140} level="M" />
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/75">
          <p>
            <strong>For your tax records:</strong> after sending, drop us a note
            through{' '}
            <Link
              href="/contact?topic=Stock or crypto donation"
              onClick={() => setOpen(false)}
              className="underline decoration-dotted decoration-from-font underline-offset-[3px] transition-colors hover:decoration-solid hover:text-sage"
            >
              the contact form
            </Link>{' '}
            with the transaction hash and your name so we can send the
            acknowledgment letter.
          </p>
          {/* Streaming protocol shortcuts — Sablier and Superfluid both
              pipe continuous on-chain payments to a recipient over a
              chosen duration (weeks, months, years). Sablier has no URL
              pre-fill for the recipient, so donors copy the address
              above and paste it in their UI. Superfluid does honor a
              ?recipient= URL param, so we pass FFA's address ahead of
              time to save a paste. */}
          <div>
            <p>
              <strong>Prefer to stream?</strong> Set up a recurring on-chain
              gift to the address above:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`https://app.superfluid.finance/send?recipient=${FFA_ETH_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 bg-paper px-3 py-2 text-xs uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink/5"
              >
                Superfluid
                <ExternalIcon />
              </a>
              <a
                href="https://app.sablier.com/create"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 bg-paper px-3 py-2 text-xs uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink/5"
              >
                Sablier
                <ExternalIcon />
              </a>
            </div>
          </div>
        </div>
      </FormDialog>
    </>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Panel } from './PageFrame';

// Replacement for the static FeaturePanel on Artifact and Tidbit
// pages. Renders the same full-bleed image inside the white Panel,
// but tagged as a button so a tap/click opens a fullscreen lightbox
// with the image at viewport size.
//
// Most artifact images are dense (concept art, design plans) and
// hard to read inline at 800–1000px wide. The lightbox lets readers
// blow them up to fill the screen, click-anywhere or Escape closes,
// and body scroll is locked while open so the page doesn't shift.
export function InspectablePanel({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  return (
    <>
      <Panel variant="white" full className="overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Inspect: ${alt || 'image'}`}
          className="group block w-full cursor-zoom-in"
        >
          <Image
            src={src}
            alt={alt}
            width={2400}
            height={1800}
            sizes="100vw"
            priority={priority}
            className="block h-auto w-full"
          />
        </button>
      </Panel>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={alt || 'Image'}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-ink/90 p-4 backdrop-blur-sm md:p-10"
            >
              {/* Close button — anchored top-right of the viewport.
                  The whole backdrop is a click target, but the button
                  gives keyboard / screen-reader users an explicit
                  affordance. */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                aria-label="Close image"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper/15 text-paper backdrop-blur-md transition-colors hover:bg-paper/25 md:right-6 md:top-6"
              >
                <svg
                  viewBox="0 0 14 14"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>

              {/* Inner image. max-w / max-h keep the image inside the
                  viewport bounds while preserving its aspect ratio.
                  stopPropagation on the image itself prevents an
                  accidental dismiss when the user clicks the image
                  to compare a detail. */}
              <Image
                src={src}
                alt={alt}
                width={2400}
                height={1800}
                sizes="100vw"
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full cursor-default object-contain"
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

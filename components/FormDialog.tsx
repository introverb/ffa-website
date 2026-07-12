'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

// Portal-mounted modal for inline submission forms (OURS involvement,
// artwork submission, etc.). Backdrop blurs the page; clicking outside
// the panel or hitting Escape closes; body scroll is locked while the
// dialog is open. Each calling component owns its own open state and
// form contents — this just provides the shell, focus trap escape,
// and the close button.
export function FormDialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onEscape);
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-dialog-title"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-paper p-8 shadow-xl md:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
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
        <h2
          id="form-dialog-title"
          className="pr-10 text-h4 leading-tight text-ink md:text-h3"
        >
          {title}
        </h2>
        <div className="mt-6 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

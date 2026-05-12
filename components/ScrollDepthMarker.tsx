'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

// Invisible 1px sentinel that fires a GoatCounter event the first
// time it scrolls into the viewport. Drop one into each section of
// a long page (e.g. /support's Partner / catch-all) to measure
// "did the visitor scroll deep enough to see X." Single-fire per
// page-visit — re-entering the viewport on subsequent scrolls
// doesn't re-fire (we want "reached," not "passed over twice").
export function ScrollDepthMarker({ eventName }: { eventName: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || fired.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !fired.current) {
        fired.current = true;
        trackEvent(eventName);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [eventName]);

  return <div ref={ref} aria-hidden className="h-px w-px" />;
}

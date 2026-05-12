'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

// Drop-in client component that fires a single GoatCounter event when
// it mounts. Intended for form-success branches on server-rendered
// pages — e.g. /contact?sent=1 renders <TrackSubmission eventName=
// "submit:contact" /> inside the success state so analytics records
// "this submission landed" without depending on JS handlers in the
// form itself. Idempotent within a single mount; won't double-fire
// on re-renders.
export function TrackSubmission({ eventName }: { eventName: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent(eventName);
  }, [eventName]);
  return null;
}

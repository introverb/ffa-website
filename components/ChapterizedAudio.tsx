'use client';

import { useRef } from 'react';
import type { AudioChapter } from '@/lib/possibilia';

// Native <audio> element with a clickable chapter index beneath it.
// Each chapter button seeks the player to that timestamp and starts
// playback, so listeners can jump to the part they want.
export function ChapterizedAudio({
  src,
  chapters,
}: {
  src: string;
  chapters?: AudioChapter[];
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  function seek(time: string) {
    const seconds = parseTime(time);
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = seconds;
    el.play().catch(() => {
      /* user-gesture / autoplay restrictions */
    });
  }

  return (
    <div>
      <audio ref={audioRef} src={src} controls preload="metadata" className="w-full" />
      {chapters && chapters.length > 0 && (
        <ul className="mt-6 space-y-2 text-body leading-relaxed">
          {chapters.map((c) => (
            <li key={c.time}>
              <button
                type="button"
                onClick={() => seek(c.time)}
                className="group flex items-baseline gap-4 text-left text-ink/85 hover:text-sage"
              >
                <span className="w-16 shrink-0 font-mono text-sm uppercase tracking-wider text-sage group-hover:text-sage-light">
                  {c.time}
                </span>
                <span className="underline decoration-from-font underline-offset-4 decoration-transparent group-hover:decoration-sage">
                  {c.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function parseTime(time: string): number {
  const parts = time.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

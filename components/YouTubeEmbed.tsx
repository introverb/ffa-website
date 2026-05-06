'use client';

import { useState } from 'react';
import Image from 'next/image';

// Embeds a YouTube video in a 16:9 frame. Used for Possibilia interview
// conversations that are video-first or too large to ship through Git LFS.
//
// We render in two stages to keep the YouTube branding off-screen until
// the user actually wants to watch:
//
// 1. Initial state: a custom poster image (passed in via `poster`, or
//    the package's hero artwork) with our own play-button overlay. No
//    iframe loaded, no YouTube thumbnail, no "Watch on YouTube" link.
// 2. Click → swap to the iframe with `autoplay=1`. The browser allows
//    autoplay because there was a real user gesture, so playback starts
//    immediately.
//
// Once playing, YouTube's chrome (controls, logo on hover) does come
// back - that's a YouTube TOS limitation we can't get around without
// switching to a paid host like Vimeo Pro. But the *first impression*
// of the panel is fully custom, which is what reads.
//
// `youtube-nocookie.com` is YouTube's privacy-enhanced embed host: no
// tracking cookies until playback actually starts.
export function YouTubeEmbed({
  videoId,
  title,
  poster,
}: {
  videoId: string;
  title?: string;
  poster?: string;
}) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-ink/5">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title ?? 'Interview video'}
          allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={title ? `Play: ${title}` : 'Play interview'}
      className="group relative block aspect-video w-full overflow-hidden rounded-md bg-ink/5"
    >
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
      )}
      {/* Subtle dark wash so the play button reads on light + dark posters */}
      <div className="absolute inset-0 bg-ink/15 transition group-hover:bg-ink/25" />
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/90 shadow-lg backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-paper">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-1 h-6 w-6 text-ink"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}

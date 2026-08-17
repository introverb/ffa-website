import { OURS } from './tokens';

// Visions of the Future — the broadcast that ran on loop all evening:
// technologists, artists and researchers answering one question about
// the future, cut as a retro desktop transmission.
//
// The full 33-minute cut streams from YouTube (self-hosting it was
// ~155MB — see git history for the short-lived excerpt approach). It
// plays the way it did in the room: already running, muted, on loop —
// the viewer can unmute or full-screen through the player controls.
// `playlist=<id>` is how a single YouTube video is made to loop, and
// youtube-nocookie keeps tracking cookies out until playback.
const VIDEO_ID = '4LgqHTmZg1M';

export function VisionsSection() {
  return (
    <div className="mt-8">
      <div
        className="relative aspect-video w-full overflow-hidden rounded-3xl"
        style={{ background: OURS.ink }}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&rel=0&modestbranding=1`}
          title="Visions of the Future — the OURS broadcast"
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
        />
        {/* thin OURS-orange stroke, matching the Ledgerworks wall and
            the header panel */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ boxShadow: `inset 0 0 0 1px ${OURS.orange}` }}
        />
      </div>
      <p
        className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ color: OURS.gray }}
      >
        The full broadcast — 33 minutes, as it ran in the room · unmute in the player
      </p>
    </div>
  );
}

import { OURS } from './tokens';

// Visions of the Future — the broadcast that ran on loop all evening:
// technologists, artists and researchers answering one question about
// the future, cut as a retro desktop transmission.
//
// The file on the page is a 3-minute excerpt (16MB) — the full
// 33-minute cut is ~155MB even compressed, too heavy to self-host on
// an autoplaying page. When the full broadcast lands on FFA's Vimeo,
// swap the <video> for the embed and drop the excerpt note.
export function VisionsSection() {
  return (
    <div className="mt-8">
      <video
        src="/images/ours/visions-wall-excerpt.mp4"
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        className="block w-full overflow-hidden rounded-3xl"
      />
      <p
        className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ color: OURS.gray }}
      >
        Excerpt — the full broadcast ran 33 minutes on loop, all evening.
      </p>
    </div>
  );
}

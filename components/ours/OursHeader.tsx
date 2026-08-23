import Image from 'next/image';
import { OURS } from './tokens';

// OURS page header. Deliberately separate from the shared <PageHeader>,
// because this page departs from the site default in ways the shared
// component shouldn't have to carry:
//
//   1. Frost dropped 50% — the site default blurs at 64px behind a 35%
//      paper veil. Here it's 32px behind ~18%, so the astronaut/alpine
//      collage stays legible as an image instead of an atmospheric wash.
//   2. A 1px OURS-orange stroke around the panel.
//   3. The title set in the site's display face, as on every other page
//      (it carried the branded wordmark image for the event run).
//   4. A media half — video once the edit lands, a placeholder until then.
//
// Layout: title + summary + the event's facts stack in one column; the
// other half is the media well, running full-bleed to the panel edge.
type OursHeaderProps = {
  /** Body copy under the wordmark. */
  summary: React.ReactNode;
  /** Date / venue / city, set as a mono meta line under the summary.
   *  Ink throughout; only the separator rules carry the orange. */
  meta: string[];
  /** Frosted backdrop. */
  image?: string;
  /** Video for the media well. Falls back to a placeholder when absent. */
  video?: string;
  poster?: string;
  /** Which side the media well sits on. */
  mediaSide?: 'left' | 'right';
};

export function OursHeader({
  summary,
  meta,
  image = '/images/ours/header.jpg',
  video,
  poster,
  mediaSide = 'right',
}: OursHeaderProps) {
  const mediaFirst = mediaSide === 'left';
  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-paper text-ink"
      style={{ boxShadow: `inset 0 0 0 1px ${OURS.orange}` }}
    >
      {/* Frosted backdrop, at half the site's usual frost. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden rounded-3xl">
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="scale-125 object-cover"
          style={{ filter: 'blur(32px)' }}
          priority
        />
        <div className="absolute inset-0 bg-paper/[0.18]" />
      </div>

      <div
        className={`relative grid md:min-h-[430px] ${
          mediaFirst ? 'md:grid-cols-[1fr_1.1fr]' : 'md:grid-cols-[1.1fr_1fr]'
        }`}
      >
        {/* ---------------- text ---------------- */}
        <div
          className={`flex flex-col justify-center p-8 md:p-12 ${
            mediaFirst ? 'md:order-2' : ''
          }`}
        >
          <p className="text-xs uppercase tracking-[0.18em] text-ink/70">
            Foundation for Future Aesthetics is proud to present
          </p>
          <hr className="mt-3 h-px border-0" style={{ background: OURS.orange }} />

          {/* Title set in the site's display face, like every other page
              header (the branded wordmark + its orange rule used to sit
              here). */}
          <h1 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">OURS</h1>

          <div className="mt-7 max-w-prose text-body-lg leading-relaxed text-ink/85">
            {summary}
          </div>

          {/* Date · venue · city, separated by orange rules. */}
          <ul className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
            {meta.map((m, i) => (
              <li key={m} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden className="h-3 w-px" style={{ background: OURS.orange }} />
                )}
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.14em]"
                  style={{ color: OURS.ink }}
                >
                  {m}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- media well ---------------- */}
        <div
          className={`relative overflow-hidden md:min-h-full ${
            mediaFirst ? 'md:order-1' : ''
          }`}
        >
          {video ? (
            // The film renders at its true 16:9 aspect — centred in the
            // well over the frosted backdrop rather than cover-cropped
            // to the panel's shape. On phones the well is exactly the
            // film plus the same 32px the text column gets, so the
            // spacing above and below the film matches everything else.
            <div className="flex items-center justify-center px-8 pb-8 pt-0 md:absolute md:inset-0 md:p-8">
              <video
                src={video}
                poster={poster}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                className="w-full rounded-xl md:max-h-full"
                style={{ aspectRatio: '16 / 9', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div className="absolute inset-0">
              <Image
                src={image}
                alt=""
                fill
                sizes="50vw"
                className="object-cover"
                style={{ objectPosition: '70% 50%' }}
              />
              {/* Placeholder until the edit lands. */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/35 backdrop-blur-[2px]">
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full border"
                  style={{ borderColor: OURS.orange, background: 'rgba(40,40,40,0.35)' }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 0,
                      height: 0,
                      marginLeft: 4,
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      borderLeft: `16px solid ${OURS.orange}`,
                    }}
                  />
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: OURS.cream }}
                >
                  Event film to come
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

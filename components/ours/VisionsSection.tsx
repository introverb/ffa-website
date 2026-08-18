'use client';

import { OURS } from './tokens';

// Visions of the Future — the broadcast that ran on loop all evening:
// technologists, artists and researchers answering one question about
// the future, cut as a retro desktop transmission.
//
// Layout: the framing copy with the printed admission ticket spinning
// beside it (same slow turn as the catalog book in About), the full
// 33-minute broadcast streaming from YouTube (muted, looping, the way
// it ran in the room), the closing copy, the lineup, and the closing
// feature. Ticket faces are cropped from the actual print run
// (VISIONS_Tickets_001-200_DUPLEX.pdf, ticket N° 001).
const VIDEO_ID = '4LgqHTmZg1M';

const TICKET_W = 252;
const TICKET_H = Math.round(TICKET_W * (1368 / 648)); // 532 — the die-cut's real aspect
const TICKET_D = 6; // thickness — reads as heavy card stock

const LINEUP: { name: string; detail: string }[] = [
  { name: 'Ada Palmer', detail: 'Historian & Novelist · Too Like the Lightning; Perhaps the Stars' },
  { name: 'Lisa Kaltenegger', detail: 'Astronomer · Carl Sagan Institute' },
  { name: 'Audrey Tang', detail: 'Cyber Ambassador at Large · Taiwan' },
  { name: 'Bruce Schneier', detail: 'Cryptographer · Public-Interest Technologist' },
  { name: 'Eli Dourado', detail: 'Philanthrocapitalist · Progress & Abundance' },
  { name: 'Michael Balangue', detail: 'Artist · Biodesign Challenge' },
  { name: 'Charles Rosenbauer', detail: 'Philosopher & Engineer · American Compute Company' },
  { name: 'Alexis Shotwell', detail: 'Philosopher · Anthropology & Sociology' },
  { name: 'João Pedro de Magalhães', detail: 'Biologist of Ageing · Univ. of Birmingham' },
];

export function VisionsSection() {
  return (
    <div className="mt-8">
      {/* ---------------- framing copy + the spinning ticket ---------------- */}
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-center">
        <div className="max-w-[68ch] space-y-5 text-body-lg leading-relaxed text-ink/85">
          <p>
            The future is imagined, argued for, competed over, collaborated on, and
            ultimately built. Everyone who contributes begins from their own vantage
            point. The more of reality we come to understand, and the more of one
            another&rsquo;s perspectives we take in, the more of the future we can
            see. That is part of what this installation is for.
          </p>
          <p>
            Across these screens, various visionaries are thinking and speaking on
            their contributions to tomorrow. People from many disciplines and fields
            answer the same question: what tomorrow are you working to make real?
            Maybe it&rsquo;s a world with geothermal cities, or without death, or
            where we&rsquo;ve figured out mental preservation during long space
            voyages. These are not predictions, and they are not wishes. They are
            commitments, spoken aloud by people already acting on them.
          </p>
        </div>

        {/* The admission ticket, die-cut at its printed border (tear
            notches included), turning upright on the vertical axis over
            a slow bob. Edge faces give it the thickness of real card
            stock. Hovering anywhere over it pauses the motion. */}
        {/* pt-10 mirrors the video's mt-10 below, so the ticket centres
            on the full visual span from the top of the copy to the top
            of the video — not just the copy row. */}
        <div
          className="ours-ticket hidden items-center justify-center self-stretch pt-10 md:flex"
          style={{ perspective: 1800 }}
        >
          <div className="ours-ticket-bob">
            <div
              className="ours-ticket-spin relative"
              style={{ width: TICKET_W, height: TICKET_H, transformStyle: 'preserve-3d' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ours/visions-ticket-front.webp"
                alt="Admission ticket N° 001 for Visions of the Future — the video installation, hosted by Ada Palmer."
                className="absolute inset-0 h-full w-full"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: `translateZ(${TICKET_D / 2}px)`,
                  boxShadow: '0 26px 50px -18px rgba(0,0,0,0.45)',
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ours/visions-ticket-back.webp"
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: `rotateY(180deg) translateZ(${TICKET_D / 2}px)`,
                  boxShadow: '0 26px 50px -18px rgba(0,0,0,0.45)',
                }}
              />
              {/* card-stock edges */}
              {(
                [
                  { w: TICKET_D, h: '100%', t: `rotateY(-90deg) translateZ(${TICKET_W / 2}px)`, bg: '#e6e3dc' },
                  { w: TICKET_D, h: '100%', t: `rotateY(90deg) translateZ(${TICKET_W / 2}px)`, bg: '#e6e3dc' },
                  { w: '100%', h: TICKET_D, t: `rotateX(90deg) translateZ(${TICKET_H / 2}px)`, bg: '#efede7' },
                  { w: '100%', h: TICKET_D, t: `rotateX(-90deg) translateZ(${TICKET_H / 2}px)`, bg: '#efede7' },
                ] as const
              ).map((e, i) => (
                <span
                  key={i}
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: e.w,
                    height: e.h,
                    transform: `translate(-50%, -50%) ${e.t}`,
                    background: e.bg,
                    backfaceVisibility: 'hidden',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- the broadcast ---------------- */}
      <div
        className="relative mt-10 aspect-video w-full overflow-hidden rounded-3xl"
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

      {/* ---------------- the charge ---------------- */}
      <div className="mt-10 max-w-[75ch] space-y-5 text-body-lg leading-relaxed text-ink/85">
        <p>
          This is what shaping the future actually looks like: many people, working
          on many hard problems, each from where they stand, together. Now add your
          voice. Find the tomorrow you are willing to work for, and go make it
          real. The future belongs to the people who show up to build it, and there
          is room, and need, for you.
        </p>
      </div>

      {/* ---------------- the lineup ---------------- */}
      <div className="mt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.orange }}>
          The Lineup
        </p>
        <hr className="mt-1.5 h-[2px] w-12 border-0" style={{ background: OURS.orange }} />
        <div className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {LINEUP.map((p) => (
            <div key={p.name}>
              <p className="font-heading text-[15px] uppercase leading-tight" style={{ color: OURS.ink }}>
                {p.name}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: OURS.gray }}>
                {p.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- closing feature ---------------- */}
      <div className="mt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.orange }}>
          Closing Feature
        </p>
        <hr className="mt-1.5 h-[2px] w-12 border-0" style={{ background: OURS.orange }} />
        <p className="mt-4 font-heading text-h5 uppercase leading-tight" style={{ color: OURS.ink }}>
          Dear Human, My Muse (2024)
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: OURS.gray }}>
          A short film by Vanessa Rosa
        </p>
        <p className="mt-3 max-w-[68ch] text-body italic leading-relaxed text-ink/80">
          Future beings who claim to have created our reality reach out to
          humanity. This is a letter of compassion from one of them to us.
        </p>
      </div>

      <style jsx global>{`
        @keyframes ours-ticket-spin {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(180deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        .ours-ticket-spin {
          animation: ours-ticket-spin 12s linear infinite;
        }
        @keyframes ours-ticket-bob {
          from {
            transform: translateY(-4px);
          }
          to {
            transform: translateY(4px);
          }
        }
        .ours-ticket-bob {
          animation: ours-ticket-bob 5.2s ease-in-out infinite alternate;
        }
        .ours-ticket:hover .ours-ticket-spin,
        .ours-ticket:hover .ours-ticket-bob {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ours-ticket-spin {
            animation: none;
            transform: rotateY(-24deg);
          }
          .ours-ticket-bob {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

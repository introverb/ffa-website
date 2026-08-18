import { OURS } from './tokens';
import { THIN_CTA } from '@/components/storefront/BuyModal';

// The Future is OURS — the sign-off. The manifesto's closing line as
// the headline, the full credits of everyone who said yes, the three
// doors out of the building (Possibilia, The Gallery, Eucatastrophe),
// and one last photograph: a guest alone with RERO's panel, reading
// the night's thesis off the wall.

type Credit = { name: string; detail?: string; href?: string };

const GALLERY_ARTISTS: Credit[] = [
  { name: 'RERO', href: 'https://rero-studio.squarespace.com/' },
  { name: 'Anyanwu', href: 'https://weareanyanwu.com/' },
  { name: 'Giorgia Lupi', href: 'https://studio.giorgialupi.com/' },
  { name: 'Dylan Weiler', href: 'https://www.dylanevansweiler.com/' },
  { name: 'Seungjun Na', href: 'https://www.instagram.com/na_tist' },
  { name: 'Denis Pakowacz', href: 'https://www.behance.net/pakowacz' },
  { name: 'Sue Ellen Zhang', href: 'https://bio.site/sueellen' },
  { name: 'Ellynne Dec', href: 'https://ellynne.studio/' },
  { name: 'Vanessa Rosa', href: 'https://www.littlemartians.world/' },
  { name: 'Sev Gedra', href: 'https://sevgedramakes.com/' },
  { name: 'Olli Payne', href: 'https://olli.vision' },
];

const LEDGERWORKS_ARTISTS: Credit[] = [
  { name: 'Mauricio Pommella', href: 'https://mpommella.com/' },
  { name: 'Recycle Group', href: 'https://recyclegroup.fr/' },
  { name: 'Yura Miron', href: 'https://yuramiron.art/' },
  { name: 'AnjolaDave', href: 'https://anjieverselabs.com/' },
  { name: 'Nahuel Aquiles', href: 'https://genpi.org' },
];

const SPEAKERS: Credit[] = [
  {
    name: 'Erika Alden DeBenedictis',
    detail: 'Physicist & biological engineer · Pioneer Labs',
    href: 'https://www.erikadebenedictis.com/',
  },
  {
    name: 'Geoff Anders',
    detail: 'Philosopher · Founder, Leverage',
    href: 'https://www.geoffanders.com/',
  },
];

const VISIONS: Credit[] = [
  { name: 'Ada Palmer', detail: 'Historian & novelist', href: 'https://www.adapalmer.com/' },
  { name: 'Lisa Kaltenegger', detail: 'Astronomer · Carl Sagan Institute' },
  { name: 'Audrey Tang', detail: 'Cyber Ambassador at Large · Taiwan', href: 'https://cyberambassador.tw/' },
  { name: 'Bruce Schneier', detail: 'Cryptographer & public-interest technologist' },
  { name: 'Eli Dourado', detail: 'Economist · Progress & abundance', href: 'https://www.elidourado.com/about' },
  { name: 'Michael Balangue', detail: 'Biodesigner & artist', href: 'https://anitosoul.earth/' },
  { name: 'Charles Rosenbauer', detail: 'Philosopher & engineer · American Compute Company' },
  { name: 'Alexis Shotwell', detail: 'Philosopher', href: 'https://www.alexisshotwell.com/' },
  { name: 'João Pedro de Magalhães', detail: 'Biologist of ageing · Univ. of Birmingham', href: 'https://jp.senescence.info/' },
];

const SUPPORTERS: Credit[] = [
  { name: 'Emergent Ventures', detail: 'Philanthropic grantor', href: 'https://www.mercatus.org/emergent-ventures' },
  { name: 'Leverage', detail: 'Commissioning partner', href: 'https://leverage.institute/' },
  { name: 'Medici Magazine', detail: 'Commissioning partner', href: 'https://medicimag.com/' },
  { name: 'Nucleonics Institute', detail: 'Commissioning partner', href: 'https://nucleonics.org/' },
  { name: 'GenPi', detail: 'Proceeds-sharing partner', href: 'https://genpi.org/' },
  { name: 'Geoff Anders', detail: 'Founding patron', href: 'https://www.geoffanders.com/' },
  { name: 'Unnamed Patron', detail: 'Featured-work commissioning partner' },
  { name: 'Reign', detail: 'Afterparty host', href: 'https://clubreign.com/' },
];

function CreditName({ credit }: { credit: Credit }) {
  const cls = 'font-heading text-[15px] uppercase leading-tight';
  if (!credit.href) {
    return (
      <p className={cls} style={{ color: OURS.ink }}>
        {credit.name}
      </p>
    );
  }
  return (
    <a
      href={credit.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} block w-fit transition-opacity hover:opacity-60`}
      style={{ color: OURS.ink }}
    >
      {credit.name}
    </a>
  );
}

function CreditGroup({ label, credits }: { label: string; credits: Credit[] }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: OURS.orange }}>
        {label}
      </p>
      <ul className="mt-3 space-y-2.5">
        {credits.map((c) => (
          <li key={c.name}>
            <CreditName credit={c} />
            {c.detail && (
              <p className="mt-0.5 font-mono text-[10px] leading-snug" style={{ color: OURS.gray }}>
                {c.detail}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ThanksSection() {
  return (
    <div className="mt-8">
      {/* ---------------- the sign-off ---------------- */}
      <h2
        className="max-w-[24ch] font-heading uppercase leading-[1.1]"
        style={{ color: OURS.ink, fontSize: 'clamp(26px, 3.6vw, 44px)' }}
      >
        The future isn&rsquo;t something we wait for. It&rsquo;s something we imagine, plan,
        and create. <span style={{ color: OURS.orange }}>It&rsquo;s OURS.</span>
      </h2>
      <p className="mt-6 max-w-[62ch] text-body-lg leading-relaxed text-ink/85">
        On August 9th, a room in Brooklyn filled with people who believe that. To everyone
        who hung a work, gave a talk, sent a vision, played the game, collected a piece, or
        simply showed up — thank you. OURS was made by the people below.
      </p>

      {/* ---------------- the credits ---------------- */}
      <div className="mt-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.orange }}>
          The Credits
        </p>
        <hr className="mt-1.5 h-[2px] w-12 border-0" style={{ background: OURS.orange }} />
        <div className="mt-6 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <CreditGroup label="The Gallery" credits={GALLERY_ARTISTS} />
          <div className="space-y-10">
            <CreditGroup label="Ledgerworks" credits={LEDGERWORKS_ARTISTS} />
            <CreditGroup label="Speakers" credits={SPEAKERS} />
          </div>
          <CreditGroup label="Visions of the Future" credits={VISIONS} />
        </div>
        <div className="mt-10 border-t pt-8" style={{ borderColor: OURS.hair }}>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: OURS.orange }}>
                With gratitude to our supporters
              </p>
            </div>
            {SUPPORTERS.map((c) => (
              <div key={c.name}>
                <CreditName credit={c} />
                {c.detail && (
                  <p className="mt-0.5 font-mono text-[10px] leading-snug" style={{ color: OURS.gray }}>
                    {c.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- what's next ---------------- */}
      <div className="mt-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: OURS.orange }}>
          What&rsquo;s Next
        </p>
        <hr className="mt-1.5 h-[2px] w-12 border-0" style={{ background: OURS.orange }} />
        <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-3">
          <div className="flex flex-col">
            <p className="font-heading text-h5 uppercase leading-tight" style={{ color: OURS.ink }}>
              Possibilia
            </p>
            <p className="mt-2 text-body leading-relaxed text-ink/85">
              Optimistic, realistic science fiction — a new magazine of futures worth
              wanting, and the craft it takes to get there.
            </p>
            <p className="mt-3 pt-1">
              <a href="/possibilia-preorder" className={THIN_CTA} style={{ color: OURS.orange }}>
                Preorder Issue 0 →
              </a>
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-heading text-h5 uppercase leading-tight" style={{ color: OURS.ink }}>
              The Gallery
            </p>
            <p className="mt-2 text-body leading-relaxed text-ink/85">
              Salons, dinners, art, and the rooms where nights like this one keep
              happening — all year.
            </p>
            <p className="mt-3 pt-1">
              <a href="/q/join" className={THIN_CTA} style={{ color: OURS.orange }}>
                Become a member →
              </a>
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-heading text-h5 uppercase leading-tight" style={{ color: OURS.ink }}>
              Eucatastrophe
            </p>
            <p className="mt-2 text-body leading-relaxed text-ink/85">
              Fighting doom with research — optimistic scenarios anchored to evidence you
              can inspect, claim by claim.
            </p>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: OURS.gray }}>
                Beta · Early 2027
              </span>
              <a href="/eucatastrophe" className={THIN_CTA} style={{ color: OURS.orange }}>
                Take an early look →
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- the last photograph ---------------- */}
      <div className="relative mt-14 overflow-hidden rounded-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ours/thanks-rero-viewer.webp"
          alt="A guest in a white polo stands alone before RERO's black panel, reading A NEW CITY WILL BE BUILT…"
          className="block h-auto w-full"
          draggable={false}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ boxShadow: `inset 0 0 0 1px ${OURS.orange}` }}
        />
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: OURS.gray }}>
        RERO — A New City Will Be Built… · OURS, August 9, 2026
      </p>
    </div>
  );
}

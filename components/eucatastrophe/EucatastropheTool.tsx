'use client';

import { useState } from 'react';

// Eucatastrophe — guided demo tool, dressed as a dark terminal. A locked,
// search-style landing opens onto one fully-worked scenario: a credibly
// optimistic answer built outward from already-true facts, every claim
// colour-coded by how far along it is (already real / frontier / to
// build), inspectable for its receipts and red-team, and closing with an
// "agency" step. The agency step reads the reader's situation (two dials
// + free text) and returns ranked, evidence-rated directions with
// expandable receipts. Content is curated for one question and one guided
// persona (an exhausted ER nurse); the search field and intake are fixed.
//
// Visual language: dark / terminal. IBM Plex Mono-forward on a near-black
// charcoal mat (from SiteChrome). The three FFA accents do functional
// work — sage = green (already real, terminal prompt), flare = orange
// (frontier, primary actions), horizon = blue (to build, links). Bright
// on dark; hairline borders; no rounding.

const SANS = 'var(--font-plex), "IBM Plex Sans", system-ui, sans-serif';
const MONO = 'var(--font-plex-mono), "IBM Plex Mono", ui-monospace, monospace';

// Dark theme tokens (brightened FFA accents for legibility on charcoal).
const PANEL = '#211f1b'; // elevated surface
const BORDER = '#3c382f'; // hairline
const TEXT = '#d8d2c6'; // body (taupe, light)
const HEAD = '#f2ede3'; // headings (near-white cream)
const DIM = '#8b857a'; // muted
const GREEN = '#8fb89a'; // sage ↑
const ORANGE = '#ef7a2e'; // flare ↑
const BLUE = '#93bcd4'; // horizon ↑

type Status = 'real' | 'frontier' | 'build';

interface Claim {
  text: string;
  status: Status;
  badge: string;
  why: string;
  sources: string[];
  rtType: 'held' | 'gap';
  rtLabel: string;
  rt: string;
}

const QUESTION = 'will we catch the next pandemic before it spreads?';

// Locked examples shown under the search as "coming soon" — phrased
// like real anxieties people actually type, not polished headlines.
const SOON_QUERIES = [
  'is AI coming for my job?',
  'will my kids have a livable planet?',
  'are we ever going to cure cancer?',
  'will I ever be able to afford a house?',
  'is democracy going to make it?',
];

const CLAIMS: Record<string, Claim> = {
  c1: {
    text: 'A vaccine can be designed within days',
    status: 'real',
    badge: 'already real',
    why: 'The COVID-19 vaccine was designed from the published sequence in about two days, in January 2020. The platform has only gotten faster since.',
    sources: ['Vaccine design timeline, 2020', 'mRNA platform review, 2023'],
    rtType: 'held',
    rtLabel: 'Red-team: held',
    rt: 'Challenged as “design isn’t manufacture or distribution.” True — so the claim is scoped to design speed, and at that, it stands.',
  },
  c2: {
    text: 'Cities already scan their wastewater',
    status: 'real',
    badge: 'already real',
    why: 'Wastewater surveillance scaled worldwide during COVID-19 and now runs in hundreds of municipalities, tracking several pathogens at once.',
    sources: ['National wastewater program briefing', 'Wastewater surveillance review, 2024'],
    rtType: 'held',
    rtLabel: 'Red-team: held',
    rt: 'Challenged as “coverage is uneven.” Correct — the claim is that the capability exists and is deployed, not that it’s universal. That holds.',
  },
  c3: {
    text: 'Catching truly novel agents is the frontier',
    status: 'frontier',
    badge: 'frontier',
    why: 'Pilots detect known pathogens reliably; catching genuinely novel agents at city scale is shown in research, not yet standard practice.',
    sources: ['Metagenomic early-detection pilot, preprint'],
    rtType: 'gap',
    rtLabel: 'The gap → the bridge',
    rt: 'The gap: novel pathogens that shed in low amounts can slip past today’s assays. The bridge: broad metagenomic sequencing is maturing fast and is the focus of several active programs.',
  },
  c4: {
    text: 'Real-time data-sharing across borders',
    status: 'build',
    badge: 'to build',
    why: 'Fast cross-border sharing of outbreak data is mostly aspirational today; it depends on agreements that don’t yet exist at scale.',
    sources: ['Global health data-sharing analysis, 2023'],
    rtType: 'gap',
    rtLabel: 'The gap → the bridge',
    rt: 'The gap: countries hesitate to share outbreak data quickly. The bridge: pandemic-treaty talks and regional pacts are drafting exactly these mechanisms now.',
  },
};

// real = green, frontier = orange, build = blue.
const STATUS_COLOR: Record<Status, string> = {
  real: GREEN,
  frontier: ORANGE,
  build: BLUE,
};

// ---- Agency step: the lives the demo-user picks from ----
//
// Six everyman + four less-ordinary (a PhD student, a software
// engineer, an artist, a venture capitalist). Each one's leverage is
// different — a place to host, hours to give, a skill to lend, or (for
// the one who has it) capital to deploy. `situation` is first-person
// (shown in the readout); `readback` is the second-person reflection on
// the results step. Their directions live in PERSONA_DIRECTIONS, keyed
// by id, and are deliberately matched to means — only the investor is
// ever asked for money.
interface Persona {
  id: string;
  role: string; // label on the picker card
  tag: string; // short descriptor under the label
  situation: string;
  readback: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'grocery',
    role: 'Grocery night manager',
    tag: 'overnight shift, 24-hour store',
    situation:
      'I run the overnight shift at a 24-hour grocery off the interstate — restocking, covering registers. I’m the one who notices the cold-and-flu shelf clear out three nights running.',
    readback:
      'You sit on a community chokepoint with a sewer line — the exact kind of place wastewater surveillance is built on. Your leverage is the location itself, and it costs you nothing.',
  },
  {
    id: 'bus',
    role: 'School bus driver',
    tag: 'same suburban route, nine years',
    situation:
      'I drive the same school-bus route in a Columbus suburb — nine years, forty kids twice a day. I’m the first adult half the neighborhood’s kids see each morning.',
    readback:
      'You’re plugged into a school — and schools are where a respiratory wave shows up first. Your leverage isn’t money or spare time; it’s sitting right on top of a natural early-warning site.',
  },
  {
    id: 'trucker',
    role: 'Long-haul trucker',
    tag: 'coast-to-coast freight',
    situation:
      'I drive freight coast to coast, sleeping in truck stops, same dispatcher on the radio every morning. I’ve watched the whole country roll past my windshield.',
    readback:
      'Your routes are a national transect — you physically connect the regions a detection network needs to sample. Your leverage is reach across the map, not just one city.',
  },
  {
    id: 'barber',
    role: 'Barber',
    tag: 'same chair, ten years',
    situation:
      'I’ve cut hair at the same chair for a decade. People tell their barber everything, and I see a few hundred heads a month — every age, every block.',
    readback:
      'You run a high-trust storefront the whole neighborhood passes through — where a test-pickup point would actually work. Your leverage is local trust and steady foot traffic, not cash.',
  },
  {
    id: 'library',
    role: 'Retired postal worker',
    tag: 'library volunteer, mornings',
    situation:
      'Thirty-one years at the post office, and now I shelve books at the public library three mornings a week. I know the regulars — the kids, the old-timers who come in to talk.',
    readback:
      'You’ve got the two things most people don’t: real hours to give, and a public building people already trust. Your leverage is time plus a built-in community hub.',
  },
  {
    id: 'preschool',
    role: 'Stay-at-home parent',
    tag: 'two under five, runs the parent chat',
    situation:
      'I’m home with two under five, no spare cash and no commute. But I run the preschool’s parent chat — ninety families who ask me first when a bug goes around.',
    readback:
      'You don’t need money or a commute — you need the network you already run. Your leverage is a natural sentinel group (the under-fives) and a parent circle that trusts you, all reachable from the kitchen table.',
  },
  {
    id: 'phd',
    role: 'PhD student',
    tag: 'in the lab most days',
    situation:
      'I’m three years into a PhD, in the lab most days and broke most months. I can run an analysis in my sleep, but I keep wondering if any of it matters outside my committee.',
    readback:
      'You have the one input the frontier work is starved for: skilled hands and time. Your leverage isn’t money — it’s that you can actually do the science, not just fund it.',
  },
  {
    id: 'engineer',
    role: 'Software engineer',
    tag: 'ships code at a startup',
    situation:
      'I ship code at a startup — APIs, data pipelines, the usual. Decent income, not rich, and a nagging sense my skills could matter more than they do.',
    readback:
      'The last mile of this is software that barely exists yet. Your leverage is that you can build the missing piece, not just ask for it — and that skill is the real constraint.',
  },
  {
    id: 'artist',
    role: 'Freelance illustrator',
    tag: 'draws for hire, rent’s tight',
    situation:
      'I draw for hire — explainers, editorial, the odd children’s book. The work is good; the money comes and goes, and rent’s always a little tight.',
    readback:
      'People back what they can picture, and prevention is drowning in jargon. Your leverage is craft, not capital — making the invisible legible is genuinely scarce.',
  },
  {
    id: 'vc',
    role: 'Venture capitalist',
    tag: 'early-stage, writes checks',
    situation:
      'I’m an early-stage investor — I write checks and make introductions for a living. I’ve got capital and a network, and more curiosity about prevention than most of my deal flow.',
    readback:
      'For once, “just fund it” is the right answer. Your leverage is capital and dealmaking — exactly what the unglamorous, underfunded infrastructure rounds are missing.',
  },
];

// The single capacity dial. The chosen level tunes the read-back note
// (how hard to lean in) rather than swapping out the directions.
const TIME_LEVELS = ['', 'A few minutes, once', 'A quick action this week', 'A regular small habit', 'An ongoing side project', 'A serious commitment'];
const CAPACITY_NOTE = [
  '',
  'You’ve got minutes, not weekends — so start at the top: the lightest move with the highest payoff.',
  'A little time this week is enough to do the first real thing here.',
  'A small, steady habit compounds — the middle moves are built for you.',
  'With an ongoing project you can take on the organizing, not just the asking.',
  'A serious commitment puts the deepest move — helping stand the build up locally — within reach.',
];

type Rating = 'strong' | 'promising' | 'contested' | 'thin';

interface Direction {
  rank?: string;
  title: string;
  rating: Rating;
  ratingLabel: string;
  action: string;
  leverage?: string;
  evidence?: string;
  sources?: string;
  firstStep?: string;
  dashed?: boolean;
}

const RATING_COLOR: Record<Rating, string> = {
  strong: GREEN,
  promising: GREEN,
  contested: ORANGE,
  thin: DIM,
};

// Build-contribution directions, matched to means. Each life gets a
// signature move (their place, hours, skill, or capital), then a shared
// move, then the same dashed warning. Ranks are assigned at render.
// Crucially, the "write a check" move appears only for the investor —
// everyone else contributes with something other than money.

// Shared moves, reused across lives.
const D_ADVOCATE: Direction = {
  title: 'Push the money toward the build',
  rating: 'strong',
  ratingLabel: 'Strong',
  action: 'Most of the gap is funding and will, not science. A few minutes telling your representatives that pandemic early-warning deserves steady money is one of the highest-leverage things anyone can do — and it costs nothing.',
  leverage: 'High — no time or money to speak of, and constituent pressure is one of the few forces that keeps prevention funded when there’s no active outbreak to point at.',
  evidence: 'Biosurveillance and preparedness programs are chronically underfunded once an emergency passes; sustained constituent demand is among the few things that keeps prevention money on the table between crises.',
  sources: 'Pandemic-preparedness funding analyses · constituent-influence studies',
  firstStep: 'Find your representatives and send one message: fund pandemic early-warning.',
};

const D_DASHED: Direction = {
  title: 'Lower-leverage than it feels',
  rating: 'thin',
  ratingLabel: 'Thin',
  action: 'Posting hot takes and arguing the science with strangers online. It feels like doing something, but it rarely moves anyone — and it’s the same channel bad information travels. Put that energy into the moves above.',
  dashed: true,
};

// Free-text fallback, when someone writes their own situation instead of
// picking an example.
const D_FIND: Direction = {
  title: 'Find the place only you can stand',
  rating: 'promising',
  ratingLabel: 'Promising',
  action: 'The net gets built out of ordinary places — a workplace, a school, a clinic, a public building, a skill. Look at where your own life already touches one of those, and offer it: a site to host, hours to give, or a hand on the build.',
  leverage: 'Depends on your situation — but real infrastructure needs willing local hosts and hands far more than it needs another donor.',
  evidence: 'Surveillance and distribution programs are typically limited by local participation — willing sites and volunteers — rather than by technology or, past a point, money.',
  sources: 'Sentinel-surveillance & community-health-program evaluations',
  firstStep: 'Ask your county health department what they’re piloting and where they need sites or hands.',
};

const DEFAULT_DIRECTIONS: Direction[] = [D_FIND, D_ADVOCATE, D_DASHED];

// Signature move per life, then the shared advocate + dashed moves.
const PERSONA_DIRECTIONS: Record<string, Direction[]> = {
  grocery: [
    {
      title: 'Put your store on the wastewater map',
      rating: 'strong',
      ratingLabel: 'Strong',
      action: 'Your store sits on a sewer line at a spot the whole area passes through — exactly what wastewater surveillance is built from. Ask your manager and your county health department about adding a sampling point; the program brings the kit, you just host the access.',
      leverage: 'High — wastewater is the most-proven early-warning tool there is, and its biggest limit is uneven coverage. One more good site genuinely extends the net, for the price of a conversation.',
      evidence: 'Wastewater surveillance scaled worldwide during COVID-19 and now tracks several pathogens across hundreds of municipalities; the binding constraint is site coverage, not the science. New host sites at high-traffic locations measurably fill the gaps.',
      sources: 'National wastewater program briefings · wastewater surveillance reviews',
      firstStep: 'Call your county health department and ask who runs local wastewater monitoring — and whether your block has a site.',
    },
    D_ADVOCATE,
    D_DASHED,
  ],
  bus: [
    {
      title: 'Make your school an early-warning site',
      rating: 'strong',
      ratingLabel: 'Strong',
      action: 'Kids are usually where a respiratory wave shows up first, and schools make natural sentinel sites. Point your district’s nurse or front office toward the sentinel-surveillance and free-test programs your health department runs — and offer your route’s school as a willing site.',
      leverage: 'High — schools lead the curve by days, and these programs need willing sites more than anything else. A driver who knows every family is exactly who gets one signed up. No cost.',
      evidence: 'School-based surveillance reliably leads community respiratory trends, and pediatric signals often precede the wider wave. Sentinel and school-testing programs are limited mainly by participation, not technology.',
      sources: 'School-based & sentinel surveillance evaluations',
      firstStep: 'Ask your school’s office or nurse which surveillance or free-test program the district joins — and who to talk to about taking part.',
    },
    D_ADVOCATE,
    D_DASHED,
  ],
  trucker: [
    {
      title: 'Turn your route into a sampling line',
      rating: 'promising',
      ratingLabel: 'Promising',
      action: 'You cross regions most sensors never reach. Mobile and truck-stop environmental sampling is an emerging way to watch the spaces between cities — ask the research groups working on transport-corridor surveillance whether drivers can carry or host a passive sampler.',
      leverage: 'Moderate to high — coverage between metro areas is a real blind spot, and a coast-to-coast route is a rare asset. The approach is newer, so it sits a notch below the proven site-based moves.',
      evidence: 'Environmental and mobile sampling along transport corridors is an active research direction for catching spread between surveilled cities; the science is maturing rather than settled, which is why it’s promising, not proven.',
      sources: 'Transport-corridor & environmental-sampling pilots',
      firstStep: 'Look up environmental-surveillance research groups and ask whether they run any driver or truck-stop sampling pilots.',
    },
    D_ADVOCATE,
    D_DASHED,
  ],
  barber: [
    {
      title: 'Make your chair a pickup point',
      rating: 'promising',
      ratingLabel: 'Promising',
      action: 'A storefront the whole neighborhood already walks into is where free-test distribution actually works. Ask your county health department about being a pickup point for at-home tests — a small box by the register, restocked by them.',
      leverage: 'Moderate to high — getting tests into hands fast is half the battle, and trusted everyday places beat official sites for reach. Costs shelf space, not cash.',
      evidence: 'Distribution through familiar, high-traffic community sites raises test uptake compared with clinical-only channels, particularly in communities wary of official venues.',
      sources: 'Community test-distribution evaluations',
      firstStep: 'Ask your county health department whether they place at-home-test pickup boxes in local businesses.',
    },
    D_ADVOCATE,
    D_DASHED,
  ],
  library: [
    {
      title: 'Give the hours the build is short on',
      rating: 'strong',
      ratingLabel: 'Strong',
      action: 'You’ve got the scarcest thing in prevention: time, plus a public building people trust. Offer both — staff a free-test pickup point at the library, help a community-health effort, be the steady hands a local program runs on.',
      leverage: 'High — programs are chronically short of reliable volunteers, and a known, trusted face reaches the isolated and elderly that flyers never will. Pure time, no money.',
      evidence: 'Community-health and distribution programs are typically constrained by volunteer capacity, not funding or supplies; trusted local people markedly improve reach into hard-to-serve groups.',
      sources: 'Community-health-worker & volunteer-program studies',
      firstStep: 'Ask your library and county health department what they’d do with a dependable volunteer a few mornings a week.',
    },
    D_ADVOCATE,
    D_DASHED,
  ],
  preschool: [
    {
      title: 'Organize from the kitchen table',
      rating: 'strong',
      ratingLabel: 'Strong',
      action: 'You don’t need money or a commute — you need the network you already run. Get your preschool signed up as a sentinel or test site, and set up a free-test pickup the parents share. Both run on trust and a few texts, from home.',
      leverage: 'High — under-fives seed a lot of household spread, so a preschool is a real sentinel, and a trusted parent organizer is how programs actually reach families. Time and trust, zero capital.',
      evidence: 'Young children are major drivers of household and community respiratory transmission, making early-childhood settings valuable sentinels; uptake in family programs rises sharply when a trusted parent, not an agency, does the asking.',
      sources: 'Household-transmission & early-childhood surveillance studies · trusted-messenger research',
      firstStep: 'Ask your preschool director which health-department program they take part in — and offer to help the families opt in.',
    },
    D_ADVOCATE,
    D_DASHED,
  ],
  phd: [
    {
      title: 'Put your training on the frontier',
      rating: 'promising',
      ratingLabel: 'Promising',
      action: 'Catching genuinely novel pathogens — the open frontier — runs on people who can handle data and lab work. Join a surveillance lab, a metagenomics group, or a citizen-science effort; even part-time analysis moves real projects forward.',
      leverage: 'High for you — skilled time is exactly the input the frontier work is short on, and you already have it. Free to give, and it compounds into expertise.',
      evidence: 'Broad metagenomic early-detection — the path to catching novel agents — is maturing in research settings and is rate-limited by skilled analytic and lab capacity. Trained contributors directly accelerate it.',
      sources: 'Metagenomic early-detection pilots · open-surveillance projects',
      firstStep: 'Find a metagenomic-surveillance or biosecurity lab near you and ask how a student can contribute, even a few hours.',
    },
    D_ADVOCATE,
    D_DASHED,
  ],
  engineer: [
    {
      title: 'Help build the part that doesn’t exist yet',
      rating: 'promising',
      ratingLabel: 'Promising',
      action: 'The last mile is software: fast, trustworthy data-sharing across borders barely exists. Contribute to the open-source tools, standards, and platforms that outbreak data will move on — the literal thing on the “to build” list.',
      leverage: 'High for you — you can build the missing piece, not just ask for it, and skilled engineering is the constraint. Free to contribute, rare to have.',
      evidence: 'Real-time cross-border outbreak data-sharing is largely aspirational today and depends on data standards, tooling, and platforms that still have to be built — work that needs exactly this skill set.',
      sources: 'Global health data-sharing analyses · open-surveillance tooling projects',
      firstStep: 'Find an open-source biosurveillance or health-data project and pick up a “good first issue” this month.',
    },
    D_ADVOCATE,
    D_DASHED,
  ],
  artist: [
    {
      title: 'Make the invisible legible',
      rating: 'promising',
      ratingLabel: 'Promising',
      action: 'The build needs public will, and people back what they can picture. Use your craft — explainers, visuals, a clear and non-scary way to show how early warning works — and offer it to a health department or biosecurity nonprofit drowning in jargon.',
      leverage: 'Moderate — clear communication measurably moves understanding and uptake, and good design is scarce in public health. Your time and skill, not money.',
      evidence: 'Clear visual communication improves comprehension and uptake of public-health guidance; prevention efforts are routinely undercut by confusing or frightening messaging.',
      sources: 'Health-communication & risk-visualization studies',
      firstStep: 'Offer one health department or biosecurity nonprofit a single clear explainer graphic, free, as a sample.',
    },
    D_ADVOCATE,
    D_DASHED,
  ],
  vc: [
    {
      title: 'Write the checks no one else will',
      rating: 'strong',
      ratingLabel: 'Strong',
      action: 'Prevention infrastructure is unglamorous and underfunded — the exact gap patient capital is for. Back biosecurity and detection startups, de-risk the boring infrastructure rounds, and use your network to syndicate deals others won’t lead.',
      leverage: 'High — capital and dealmaking are your actual leverage, and prevention returns many times its cost. This is the rare place “just fund it” is the right answer.',
      evidence: 'Prevention and early detection are consistently found to return many times their cost versus post-outbreak response, yet stay underfunded between crises — a textbook underpriced-risk gap for early capital.',
      sources: 'Cost-of-prevention vs. response studies · biosecurity-investment analyses',
      firstStep: 'Map the biosecurity and detection startups raising now, and take one first meeting this week.',
    },
    D_ADVOCATE,
    D_DASHED,
  ],
};

// ---- Primitives ----

function Label({ children, color = DIM, className = '' }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.14em] ${className}`} style={{ fontFamily: MONO, color }}>
      {children}
    </p>
  );
}

function TermButton({
  children,
  onClick,
  accent = ORANGE,
  cue = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  accent?: string;
  // When true, the button flashes a mid-speed glow (the guided-demo
  // cue) in its accent colour — drawing the eye to the next click.
  cue?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm transition hover:bg-white/[0.04] ${cue ? 'euca-cue' : ''} ${className}`}
      style={{
        fontFamily: MONO,
        color: accent,
        background: 'transparent',
        border: `1px solid ${accent}`,
        borderRadius: 0,
        ...(cue ? ({ '--cue': accent } as React.CSSProperties) : {}),
      }}
    >
      {children}
    </button>
  );
}

const box = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: PANEL,
  border: `1px solid ${BORDER}`,
  ...extra,
});

// The guided-demo walkthrough, written in the Foundation's own voice
// and wearing the site's branding (Saira + Helvetica, a cream panel)
// rather than the tool's dark terminal skin — so it reads as the site
// guiding you, clearly distinct from the Eucatastrophe experience it
// sits beside. Shown as one discreet card off to the side, advancing
// with the step. `font-heading`/`font-sans`/`font-meta` resolve to the
// site faces even inside this page's Plex-scoped wrapper.
const STEPS = [
  {
    title: 'Run the question',
    body: 'A guided walkthrough of Eucatastrophe, a tool from the Foundation for Future Aesthetics. The question’s already typed — run it to see how it answers.',
  },
  {
    title: 'Read the scenario',
    body: 'An optimistic future, built from evidence. Each underlined claim is colour-coded by how real it is — click one for its sources and an honest red-team.',
  },
  {
    title: 'Where do you come in?',
    body: 'The real tool takes your own words. For the demo, pick an example life below to fill the field — then set how much you can take on.',
  },
  {
    title: 'Your part to play',
    body: 'Real, evidence-ranked ways to help build the part that isn’t standing yet. Open any one for the proof and the honest caveats.',
  },
];

function GuideCard({
  index,
  personaId,
  onPick,
}: {
  index: number;
  personaId?: string;
  onPick?: (id: string) => void;
}) {
  const s = STEPS[index];
  // On the "where do you come in?" step the guide grows the example
  // lives the demo offers. Clicking one fills the tool's (otherwise
  // empty, free-text) situation field — showing that the real tool
  // takes whatever you write, while the demo hands you a starting point.
  const showExamples = index === 2 && !!onPick;
  return (
    <div className="rounded-3xl border border-taupe bg-cream p-5 text-ink shadow-[0_2px_12px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between">
        <span className="font-meta text-[11px] uppercase tracking-[0.16em] text-muted">Guided demo</span>
        <span className="font-meta text-[11px] uppercase tracking-[0.16em] text-muted">
          {index + 1} / {STEPS.length}
        </span>
      </div>
      <h2 className="mt-3 font-heading text-h6 font-semibold leading-tight text-ink">{s.title}</h2>
      <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{s.body}</p>

      {showExamples && (
        <div className="mt-4 border-t border-taupe pt-4">
          <p className="font-meta text-[11px] uppercase tracking-[0.16em] text-muted">Try an example life</p>
          <div className="mt-2.5 max-h-[44vh] space-y-1.5 overflow-y-auto pr-1">
            {PERSONAS.map((p) => {
              const active = p.id === personaId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPick!(p.id)}
                  className={`block w-full rounded-xl border px-3 py-2 text-left transition ${
                    active ? 'border-sage bg-sage-light/50' : 'border-taupe bg-paper hover:border-sage'
                  }`}
                >
                  <span className="block font-sans text-sm font-semibold leading-snug text-ink">{p.role}</span>
                  <span className="mt-0.5 block font-sans text-[12px] leading-snug text-muted">{p.tag}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-1.5" aria-hidden>
        {STEPS.map((_, i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{ background: i <= index ? '#3B3A3A' : '#D8D2C6' }}
          />
        ))}
      </div>
    </div>
  );
}

function Landing({ onSearch, guide }: { onSearch: () => void; guide: React.ReactNode }) {
  return (
    <section className="flex min-h-[78vh] flex-col items-center justify-center px-6 pb-24 text-center" style={{ fontFamily: MONO }}>
      <h1 className="text-[40px] font-medium leading-none md:text-[58px]">
        <span style={{ color: GREEN }}>eucatastrophe</span>
        <span className="euca-caret" style={{ color: GREEN }}>_</span>
      </h1>
      <p className="mt-4 text-sm" style={{ color: DIM }}>
        <span style={{ color: ORANGE }}>//</span> optimism, built from evidence
      </p>

      <div className="mt-10 w-full max-w-[620px]">
        {/* On narrow screens the side rail has no room, so the guide
            rides inline above the search; on xl+ it's the fixed left
            rail instead (rendered by the caller). */}
        <div className="mb-5 xl:hidden">{guide}</div>
        {/* Prompt — tells people what to bring: a worry about the future,
            in their own words. */}
        <p className="mb-3 text-left text-body" style={{ color: HEAD }}>
          what’s the worry about the future you can’t shake?
        </p>
        {/* Terminal search line: prompt + locked query + run button. */}
        <div className="flex items-stretch" style={box()}>
          <div className="flex flex-1 items-center gap-2.5 px-3.5 py-3 text-left">
            <span style={{ color: GREEN }}>&gt;</span>
            <span className="text-sm" style={{ color: TEXT }}>{QUESTION}</span>
          </div>
          <TermButton onClick={onSearch} cue className="px-6">[ run ]</TermButton>
        </div>

        <div className="mt-6 text-left">
          <Label>popular queries</Label>
          <ul className="mt-2 space-y-1 text-sm" style={{ fontFamily: MONO }}>
            {SOON_QUERIES.map((q) => (
              <li key={q} style={{ color: DIM }}>
                <span style={{ color: BLUE }}>&gt;</span>{' '}
                <span className="underline" style={{ color: BLUE }}>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ClaimSpan({
  id,
  selected,
  onSelect,
  children,
}: {
  id: string;
  selected: boolean;
  onSelect: (id: string) => void;
  children: React.ReactNode;
}) {
  const color = STATUS_COLOR[CLAIMS[id].status];
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => onSelect(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(id);
        }
      }}
      className="cursor-pointer transition"
      style={{
        borderBottom: `2px solid ${color}`,
        background: selected ? `${color}26` : 'transparent',
        boxShadow: selected ? `0 0 0 1px ${color}` : 'none',
        color: selected ? HEAD : TEXT,
      }}
    >
      {children}
    </span>
  );
}

function Legend() {
  const dot = (c: string) => <span className="inline-block h-2.5 w-2.5" style={{ background: c }} />;
  return (
    <div className="mt-5 flex flex-wrap gap-4 text-sm" style={{ fontFamily: MONO, color: DIM }}>
      <span className="flex items-center gap-2">{dot(GREEN)}already real</span>
      <span className="flex items-center gap-2">{dot(ORANGE)}frontier</span>
      <span className="flex items-center gap-2">{dot(BLUE)}to build</span>
    </div>
  );
}

function Receipts({ claim }: { claim: Claim }) {
  const held = claim.rtType === 'held';
  const color = STATUS_COLOR[claim.status];
  const rtColor = held ? GREEN : ORANGE;
  return (
    <div className="p-5" style={box()}>
      <div className="flex items-center justify-between gap-3">
        <Label>Why this holds</Label>
        <span className="text-[11px]" style={{ fontFamily: MONO, color }}>[{claim.badge}]</span>
      </div>
      <p className="mt-3 text-body font-semibold leading-snug" style={{ color: HEAD }}>“{claim.text}”</p>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: DIM }}>{claim.why}</p>

      <Label className="mt-4">Sources</Label>
      <ul className="mt-1.5 space-y-1">
        {claim.sources.map((src) => (
          <li key={src} className="text-sm">
            <span className="underline" style={{ color: BLUE }}>{src}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 p-3" style={{ borderLeft: `2px solid ${rtColor}`, background: `${rtColor}14` }}>
        <p className="text-[11px] font-semibold" style={{ fontFamily: MONO, color: rtColor }}>{claim.rtLabel}</p>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: TEXT }}>{claim.rt}</p>
      </div>
    </div>
  );
}

function RealismBar() {
  return (
    <div className="mt-10 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-body font-semibold" style={{ color: HEAD }}>How much of this future already stands</p>
        <p className="text-sm" style={{ color: DIM }}>the rest is a build plan, not a wish</p>
      </div>
      <div className="mt-3 flex h-3" style={{ border: `1px solid ${BORDER}` }}>
        <div style={{ flex: 2, background: GREEN }} />
        <div style={{ flex: 1, background: ORANGE }} />
        <div style={{ flex: 1, background: BLUE }} />
      </div>
      <div className="mt-2 flex justify-between text-sm" style={{ fontFamily: MONO, color: DIM }}>
        <span>2 already real</span>
        <span>1 frontier</span>
        <span>1 to build</span>
      </div>
    </div>
  );
}

function Dial({
  label,
  lowLabel,
  highLabel,
  levels,
  value,
  onChange,
}: {
  label: string;
  lowLabel: string;
  highLabel: string;
  levels: string[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <Label className="mb-2">{label}</Label>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: ORANGE }}
      />
      <div className="mt-0.5 flex justify-between text-[11px]" style={{ fontFamily: MONO, color: DIM }}>
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
      <p className="mt-1.5 text-sm font-semibold" style={{ color: GREEN }}>{levels[value]}</p>
    </div>
  );
}

function DirectionCard({ d }: { d: Direction }) {
  const [open, setOpen] = useState(false);
  const color = RATING_COLOR[d.rating];
  return (
    <div
      className="mt-3 p-5"
      style={{ border: `1px ${d.dashed ? 'dashed' : 'solid'} ${BORDER}`, background: d.dashed ? 'transparent' : PANEL }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-body font-semibold leading-snug" style={{ color: d.dashed ? DIM : HEAD }}>
          {d.rank && <span className="mr-1.5 text-[11px]" style={{ fontFamily: MONO, color: DIM }}>{d.rank}</span>}
          {d.title}
        </h3>
        <span className="shrink-0 text-[11px]" style={{ fontFamily: MONO, color }}>[{d.ratingLabel}]</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: d.dashed ? DIM : TEXT }}>{d.action}</p>
      {d.leverage && (
        <p className="mt-2 text-sm" style={{ color: DIM }}>
          <span className="mr-1.5 text-[11px] uppercase tracking-[0.06em]" style={{ fontFamily: MONO, color: GREEN }}>leverage</span>
          {d.leverage}
        </p>
      )}
      {d.evidence && (
        <>
          <button type="button" onClick={() => setOpen(!open)} className="mt-2.5 text-[12px] underline" style={{ fontFamily: MONO, color: BLUE }}>
            {open ? '[ − hide the evidence ]' : '[ + show the evidence ]'}
          </button>
          {open && (
            <div className="mt-2.5 pt-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
              <p className="text-sm leading-relaxed" style={{ color: DIM }}>{d.evidence}</p>
              <Label className="mt-3">Sources &amp; first step</Label>
              <p className="mt-1 text-sm" style={{ color: BLUE }}>{d.sources}</p>
              <p className="mt-1 text-sm" style={{ color: TEXT }}>Start with: {d.firstStep}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

type AgencyStep = 'closed' | 'intake' | 'results';

const blinkStyle = `
@keyframes eucaBlink{0%,49%{opacity:1}50%,100%{opacity:0}}
.euca-caret{animation:eucaBlink 1s step-end infinite}
@keyframes eucaCue{0%,100%{box-shadow:0 0 0 0 rgba(0,0,0,0)}50%{box-shadow:0 0 13px 0 var(--cue)}}
.euca-cue{animation:eucaCue 1.1s ease-in-out infinite}
.euca-field::placeholder{color:#8b857a;opacity:1}
`;

export function EucatastropheTool() {
  const [view, setView] = useState<'landing' | 'result'>('landing');
  const [selected, setSelected] = useState('c1');
  const [agency, setAgency] = useState<AgencyStep>('closed');
  const [time, setTime] = useState(2);
  // The situation field starts empty (the real tool takes free text);
  // personaId tracks which guide example, if any, filled it.
  const [personaId, setPersonaId] = useState('');
  const [situationText, setSituationText] = useState('');
  const selectedPersona = PERSONAS.find((p) => p.id === personaId) ?? PERSONAS[0];
  const pickPersona = (id: string) => {
    setPersonaId(id);
    const p = PERSONAS.find((x) => x.id === id);
    if (p) setSituationText(p.situation);
  };

  // Current walkthrough step → drives the side guide.
  const stepIndex = view === 'landing' ? 0 : agency === 'closed' ? 1 : agency === 'intake' ? 2 : 3;

  if (view === 'landing') {
    return (
      <div style={{ fontFamily: SANS, color: TEXT }}>
        <style>{blinkStyle}</style>
        {/* FFA-branded guide, fixed off to the left on wide screens —
            the hero is narrow so the margin is free. Falls back to an
            inline card above the search below xl. */}
        <div className="pointer-events-none fixed left-6 top-1/2 z-30 hidden w-[280px] -translate-y-1/2 xl:block">
          <div className="pointer-events-auto">
            <GuideCard index={0} />
          </div>
        </div>
        <Landing onSearch={() => setView('result')} guide={<GuideCard index={0} />} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: SANS, color: TEXT }}>
      <style>{blinkStyle}</style>
      <div className="mx-auto max-w-[1380px] px-6 py-10">
        <div className="gap-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Guide rail — off to the side on lg+, sticky as you scroll;
              stacks above the content on smaller screens. At step 3 it
              also hosts the example-life picker that fills the field. */}
          <aside className="mb-6 lg:mb-0">
            <div className="lg:sticky lg:top-28">
              <GuideCard index={stepIndex} personaId={personaId} onPick={pickPersona} />
            </div>
          </aside>
          <div className="space-y-5">
        {/* Results header — query line. */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5" style={box()}>
          <div className="flex items-center gap-4">
            <span className="text-lg" style={{ fontFamily: MONO, color: GREEN }}>eucatastrophe</span>
            <div>
              <Label>your query</Label>
              <h1 className="mt-0.5 text-body font-semibold leading-tight md:text-h5" style={{ color: HEAD }}>
                <span style={{ color: GREEN }}>&gt;</span> {QUESTION}
              </h1>
            </div>
          </div>
          <TermButton accent={DIM} onClick={() => setView('landing')}>[ new search ]</TermButton>
        </div>

        {/* The worked scenario. */}
        <div className="p-6 md:p-10" style={box()}>
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="text-body-lg leading-[1.9] md:text-[20px]" style={{ color: TEXT }}>
                The good version of this future is closer than the headlines suggest.{' '}
                <ClaimSpan id="c1" selected={selected === 'c1'} onSelect={setSelected}>
                  A vaccine can be designed within days — it already happened in 2020
                </ClaimSpan>
                .{' '}
                <ClaimSpan id="c2" selected={selected === 'c2'} onSelect={setSelected}>
                  Hundreds of cities already scan their wastewater for early signs of disease
                </ClaimSpan>
                . Put those together and the shape appears: the first warning of an outbreak arrives through the sewer network, days ahead of the first emergency room.{' '}
                <ClaimSpan id="c3" selected={selected === 'c3'} onSelect={setSelected}>
                  Extending that net to catch truly novel agents is the active frontier
                </ClaimSpan>{' '}
                — the pilots work; the build is coverage.{' '}
                <ClaimSpan id="c4" selected={selected === 'c4'} onSelect={setSelected}>
                  The last mile is political: real-time data-sharing across borders
                </ClaimSpan>{' '}
                — hard, but already being drafted. None of it is guaranteed. All of it is buildable.
              </p>
              <Legend />
            </div>
            <Receipts claim={CLAIMS[selected]} />
          </div>
          <RealismBar />
        </div>

        {/* Agency step. */}
        <div className="p-6 md:p-10" style={box()}>
          {agency === 'closed' && (
            <div className="text-center">
              <p className="text-body" style={{ color: DIM }}>Still worried? Take action.</p>
              <TermButton accent={GREEN} cue className="mt-4" onClick={() => setAgency('intake')}>
                [ here’s what you could do → ]
              </TermButton>
            </div>
          )}

          {agency === 'intake' && (
            <>
              <h2 className="text-h4 font-semibold leading-tight" style={{ color: HEAD }}>Where do you come in?</h2>
              <p className="mt-2 max-w-prose text-body" style={{ color: DIM }}>
                In the real tool you’d describe your own life, in your own words. This run is guided — pick
                one of the example lives from the demo card to fill it in. Nothing is saved.
              </p>

              <Label className="mt-6">your situation</Label>
              <textarea
                value={situationText}
                onChange={(e) => {
                  setSituationText(e.target.value);
                  setPersonaId('');
                }}
                rows={3}
                placeholder="Describe your situation in your own words…"
                className="euca-field mt-2 w-full resize-none p-3.5 text-body"
                style={{ ...box(), color: TEXT, fontFamily: MONO }}
              />

              <div className="mt-6 max-w-sm">
                <Dial label="How much can you take on?" lowLabel="Minutes" highLabel="Your life" levels={TIME_LEVELS} value={time} onChange={setTime} />
              </div>

              <TermButton
                cue={!!situationText.trim()}
                accent={situationText.trim() ? ORANGE : DIM}
                className="mt-6"
                onClick={() => {
                  if (situationText.trim()) setAgency('results');
                }}
              >
                [ show me where I come in → ]
              </TermButton>
            </>
          )}

          {agency === 'results' && (
            <>
              <h2 className="text-h4 font-semibold leading-tight" style={{ color: HEAD }}>Where you come in</h2>

              <div className="mt-5 p-4" style={{ borderLeft: `2px solid ${GREEN}`, background: `${GREEN}14` }}>
                <Label color={GREEN}>{personaId ? `Reading you as — ${selectedPersona.role}` : 'Reading your own words'}</Label>
                <p className="mt-1 text-body" style={{ color: TEXT }}>
                  {personaId
                    ? selectedPersona.readback
                    : 'You described your own situation — in the full tool, that’s exactly what shapes this. For the demo, here’s where the evidence says ordinary leverage tends to live.'}{' '}
                  {CAPACITY_NOTE[time]}
                </p>
              </div>
              {(PERSONA_DIRECTIONS[personaId] ?? DEFAULT_DIRECTIONS).map((d, i) => (
                <DirectionCard key={d.title} d={{ ...d, rank: d.dashed ? undefined : String(i + 1).padStart(2, '0') }} />
              ))}
            </>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

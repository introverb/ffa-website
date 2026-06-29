import Image from 'next/image';
import { Panel } from '@/components/PageFrame';

// Community Fund panel — a clone of FFA's Artizen fund card
// ("Future Aesthetics Fund: Worlds Worth Building", Season 6), rendered
// in our own markup because Artizen sends `X-Frame-Options: DENY` +
// CSP `frame-ancestors 'none'` (a real <iframe> is impossible).
//
// Numbers come from Artizen's public Bubble Data API (read-only, CORS
// open), server-side, and only the values we can read *correctly* are
// shown: the season total, the live "fund drive" (name, art, countdown,
// match multiple), and our fund's exact score + rank (rank is computed
// by sorting all fund participants). The leaderboard's derived dollar
// figures (prize, drive raised/available) are NOT exposed as clean
// fields, so we deliberately don't fabricate them.
//
// Every fetch is cached/revalidated and wrapped in a timeout + try/catch
// — a slow, changed, or finished upstream degrades gracefully (the drive
// block disappears; worst case the panel is copy + donate button) rather
// than breaking the page. This rides an undocumented public API; if it
// changes, the live bits quietly drop and the CTA still works.
const FUND_URL =
  'https://artizen.fund/index/mf/future-aesthetics-fund-for-worlds-worth-building?season=6';
const FUND_ID = '1782511867665x729975603070500900';
const API = 'https://artizen.fund/api/1.1/obj';
// Refresh roughly hourly. ISR means this is one set of polite API calls
// per window across all visitors (and only on traffic) — far more than
// the 10/day asked for, at negligible cost. Tune this single number.
const REVALIDATE = 3600;

type Drive = {
  name: string;
  endsInDays: number | null;
  image: string | null;
  multiplier: number | null;
};
// The fund's standing in the drive: supporter sales and the match those
// sales unlocked. Both are exact API fields. (Prize is intentionally left
// out — Artizen computes it with an opaque variable we can't reproduce.)
type Breakdown = { sales: number; match: number };
type FundData = {
  raised: number | null;
  drive: Drive | null;
  rank: number | null;
  fundsTotal: number | null;
  score: number | null;
  breakdown: Breakdown | null;
};

async function api(path: string): Promise<{ response?: Record<string, unknown> & { results?: Record<string, unknown>[]; remaining?: number } }> {
  const res = await fetch(`${API}/${path}`, {
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`artizen ${res.status}`);
  return res.json();
}

const constraints = (c: object[]) => `constraints=${encodeURIComponent(JSON.stringify(c))}`;
const num = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : null);

async function getFundData(): Promise<FundData> {
  const out: FundData = { raised: null, drive: null, rank: null, fundsTotal: null, score: null, breakdown: null };

  // 1) Season total.
  try {
    const fund = (await api(`fund/${FUND_ID}`)).response as Record<string, unknown> | undefined;
    out.raised = num(fund?.['Funding $ - total season']) ?? num(fund?.['Funding - current']);
  } catch {
    /* leave null */
  }

  // 2) The current, active "fund drive" (latest by start date).
  let driveId: string | null = null;
  try {
    const r = (await api(
      `boost?${constraints([
        { key: 'Type', constraint_type: 'equals', value: 'Fund drive' },
        { key: 'status', constraint_type: 'equals', value: 'Active' },
      ])}&limit=5`,
    )).response;
    const drives = [...(r?.results ?? [])].sort(
      (a, b) => new Date(String(b['start date'])).getTime() - new Date(String(a['start date'])).getTime(),
    );
    const d = drives[0];
    if (d) {
      driveId = String(d._id);
      const endMs = d['end date'] ? new Date(String(d['end date'])).getTime() : NaN;
      const endsInDays = Number.isFinite(endMs)
        ? Math.max(0, Math.ceil((endMs - Date.now()) / 86_400_000))
        : null;
      const raw = d.image ? String(d.image) : '';
      out.drive = {
        name: String(d.Name ?? 'Fund drive'),
        endsInDays,
        image: raw ? (raw.startsWith('//') ? `https:${raw}` : raw) : null,
        multiplier: num(d['boost multiple']) ?? num(d['max multiplier']),
      };
    }
  } catch {
    /* no drive block */
  }

  // 3) Our exact score + rank among the funds in that drive.
  if (driveId) {
    try {
      const funds: Record<string, unknown>[] = [];
      let cursor = 0;
      for (let i = 0; i < 10; i++) {
        const r = (await api(
          `boostparticipant?${constraints([
            { key: 'boost', constraint_type: 'equals', value: driveId },
            { key: 'fund', constraint_type: 'is_not_empty' },
          ])}&limit=100&cursor=${cursor}`,
        )).response;
        funds.push(...(r?.results ?? []));
        if (!r || (r.remaining ?? 0) <= 0) break;
        cursor += 100;
      }
      funds.sort((a, b) => (num(b['boost score']) ?? 0) - (num(a['boost score']) ?? 0));
      out.fundsTotal = funds.length || null;
      const idx = funds.findIndex((f) => f.fund === FUND_ID);
      if (idx >= 0) {
        const me = funds[idx];
        out.rank = idx + 1;
        out.score = Math.round((num(me['boost score']) ?? 0) / 100);
        // Sales + the match they unlocked — both exact, read fields.
        const sales = num(me['fund drive sales (both)']);
        const match = num(me['match boost unlocked (both)']);
        if (sales != null && match != null) {
          out.breakdown = { sales, match };
        }
      }
    } catch {
      /* no rank/score */
    }
  }

  return out;
}

const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

// Goal bar — how far sales + the match they unlocked fill a $2,000 target.
// Both are exact API fields. Segment widths are taken against the goal (not
// each other), so the fill accurately reflects progress; sales and match
// stay distinguishable, and the remainder shows as empty track.
const FUND_GOAL = 2000;

function DriveBar({ b }: { b: Breakdown }) {
  const segments = [
    { key: 'sales', label: 'Donations', value: b.sales, color: '#718676', title: 'Donations to this fund during the drive.' },
    { key: 'match', label: 'Match unlocked', value: b.match, color: '#E8651A', title: 'Match those sales unlocked (the drive’s 3×).' },
  ];
  const raised = b.sales + b.match;
  const pct = Math.min(100, Math.round((raised / FUND_GOAL) * 100));
  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between text-sm">
        <span>
          <span className="font-semibold text-ink">{usd(raised)}</span>{' '}
          <span className="text-ink/60">of {usd(FUND_GOAL)} goal</span>
        </span>
        <span className="text-ink/60">{pct}%</span>
      </div>
      <div className="mt-2 flex h-6 w-full gap-px overflow-hidden rounded-full border border-ink bg-taupe">
        {segments.map((s) =>
          s.value > 0 ? (
            <div
              key={s.key}
              style={{ width: `${Math.min(100, (s.value / FUND_GOAL) * 100)}%`, background: s.color }}
            />
          ) : null,
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {segments.map((s) => (
          <span key={s.key} className="flex items-center gap-2" title={s.title}>
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="text-ink/70">{s.label}</span>
            <span className="font-medium text-ink">{usd(s.value)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export async function CommunityFund() {
  const d = await getFundData();
  const live = d.raised != null || d.drive != null;
  const mult = d.drive?.multiplier ?? null;

  return (
    <Panel variant="white" className="md:p-16">
      <p className="text-sm uppercase tracking-[0.08em] text-sage">Community Fund</p>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Cover — links through to the fund. */}
        <a
          href={FUND_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-goatcounter-click="community-fund:artizen-image"
          className="group relative block overflow-hidden rounded-2xl"
        >
          <Image
            src="/images/community-fund.jpg"
            alt="Future Aesthetics Fund: Worlds Worth Building, on Artizen"
            width={1200}
            height={600}
            className="h-full min-h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </a>

        {/* Widget. */}
        <div className="flex flex-col">
          <h2 className="text-h4 leading-tight md:text-h3">
            Future Aesthetics Fund: Worlds Worth Building
          </h2>

          {/* FFA's growing endowment — the Artizen fund total, framed as
              progress toward FFA's 2026 fundraising goal. */}
          {d.raised != null && (
            <div className="mt-6">
              <p className="text-sm">
                <span className="uppercase tracking-[0.08em] text-sage">Current Endowment</span>{' '}
                <span className="font-medium text-ink">{usd(d.raised)}</span>
              </p>
              <p className="mt-1 text-xs text-muted">
                Our goal is to raise $250,000 to fund arts and science initiatives in 2026.
              </p>
            </div>
          )}

          {/* Live fund-drive banner. */}
          {d.drive && (
            <div className="relative mt-4 overflow-hidden rounded-2xl bg-dark text-white">
              {d.drive.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={d.drive.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
              )}
              <div className="relative p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-white/80">
                  <span>
                    {d.rank ? `Rank #${d.rank}${d.fundsTotal ? ` of ${d.fundsTotal}` : ''}` : 'Fund drive'}
                  </span>
                  {d.score != null && <span>Score {d.score.toLocaleString('en-US')}</span>}
                </div>
                <p className="mt-3 font-heading text-h5 leading-tight">{d.drive.name}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2.5 text-sm text-white/85">
                  {d.drive.endsInDays != null && (
                    <span>
                      {d.drive.endsInDays === 0
                        ? 'Ends today'
                        : `Ends in ${d.drive.endsInDays} day${d.drive.endsInDays === 1 ? '' : 's'}`}
                    </span>
                  )}
                  {d.drive.multiplier ? (
                    <span className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-medium text-white">
                      {d.drive.multiplier}× match
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Goal bar — how far sales + match fill a $2,000 target, with
              sales and match as two distinguishable segments. */}
          {d.breakdown && <DriveBar b={d.breakdown} />}

          {/* How Artizen works — the reason to give through the fund: the
              seasonal match multiplies every gift, and breadth is rewarded
              (quadratic), so small gifts punch above their weight. Plain
              text (no panel) to keep it compact. */}
          <div className="mt-6">
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Why give through Artizen</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              {mult ? (
                <>
                  Every gift is <span className="font-semibold text-ink">matched up to {mult}×</span> in the
                  current drive, so $100 unlocks ${100 * mult} more for FFA’s artist fund.{' '}
                </>
              ) : (
                <>
                  Every gift is <span className="font-semibold text-ink">matched and multiplied</span> for FFA’s
                  artist fund.{' '}
                </>
              )}
              A handful of small gifts go further than one big one, so your donation really counts.
            </p>
          </div>

          <a
            href={FUND_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-goatcounter-click="community-fund:artizen"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-dark px-6 py-4 text-sm uppercase tracking-[0.1em] text-white transition-colors hover:bg-sage"
          >
            Donate on Artizen
          </a>
          <p className="mt-3 text-sm text-muted">
            {live ? 'Live from Artizen · Season 6' : 'On Artizen · Season 6'} · matched giving, by card or
            crypto
          </p>
        </div>
      </div>
    </Panel>
  );
}

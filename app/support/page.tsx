import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';
import { EthGiveButton } from '@/components/EthGiveButton';

export const metadata: Metadata = {
  title: 'Support',
  description:
    'Support the Foundation for Future Aesthetics, a 501(c)(3) nonprofit. Sponsor a story, an editorial package, or a full issue. All donations are tax-deductible.',
};

// Re-render the page (and re-fetch the ETH price) every 10 minutes.
// Donation copy doesn't need second-by-second precision — the actual
// on-chain amount is computed at click time anyway. 10 min keeps the
// displayed ETH amount fresh enough to feel live without burning
// through CoinGecko's free-tier rate budget.
export const revalidate = 600;

// Fetches the spot ETH/USD price from CoinGecko's free public API.
// Returns null on any failure (network, rate limit, malformed payload)
// so the caller can fall back to a generic "Give in ETH" label.
async function getEthPriceUsd(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { next: { revalidate: 600 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { ethereum?: { usd?: number } };
    const price = data?.ethereum?.usd;
    return typeof price === 'number' && price > 0 ? price : null;
  } catch {
    return null;
  }
}

const TIERS = [
  {
    name: 'Patron',
    amount: '$500',
    usd: 500,
    blurb: 'Underwrite one piece: a Possibilia story, illustration, or companion essay.',
  },
  {
    name: 'Editorial Sponsor',
    amount: '$1,500',
    usd: 1500,
    blurb:
      'Underwrite a full editorial package (story, artwork, and companion essay), plus listing as an event sponsor.',
  },
  {
    name: 'Founding Sponsor',
    amount: '$5,000+',
    usd: 5000,
    blurb: 'Underwrite a full issue of Possibilia, an exhibition, or fund your own initiative.',
  },
];

const OTHER_WAYS = [
  {
    label: 'Donor-advised funds',
    body: 'We accept grants from DAFs at Fidelity Charitable, Schwab, Vanguard, and other sponsoring organizations. Use our EIN to recommend a grant.',
  },
  {
    label: 'Stock & crypto',
    body: 'Gifts of appreciated stock or cryptocurrency are often more tax-efficient than cash. On-chain givers can also stream continuous gifts via Sablier or Superfluid. Reach out for transfer instructions.',
  },
  {
    label: 'Workplace matching',
    body: 'Many employers match employee gifts to 501(c)(3)s, often 1:1 or 2:1. We qualify on the major matching platforms (Benevity, YourCause, Bright Funds), so a few minutes on your company portal can double or triple your contribution.',
  },
];

export default async function SupportPage() {
  const ethPriceUsd = await getEthPriceUsd();
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title={<>Become a patron of the Arts &amp; Sciences.</>}
        image="/images/mission.jpg"
        body={
          <p>
            A 501(c)(3) nonprofit. Tax-deductible donations fund our contributors,
            programs, and exhibitions.
          </p>
        }
      />

      <Panel id="donate" variant="white" className="md:p-16">
        <h2 className="max-w-4xl text-h2 leading-[1.05] md:text-h2-lg">
          Fund a more optimistic future.
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {TIERS.map((t) => {
            const isPlus = t.amount.endsWith('+');
            // If the price fetch failed, fall back to a generic
            // "Give in ETH" label so the button still reads cleanly.
            const ethLabel = ethPriceUsd
              ? `Give ${(t.usd / ethPriceUsd).toFixed(2)}${isPlus ? '+' : ''} ETH`
              : 'Give in ETH';
            return (
              <div
                key={t.name}
                // p-10 (40px) at desktop matches the rest of the cream
                // cards on the site. On mobile, pair down to p-6 (24px)
                // so the card's internal padding mirrors the page-edge
                // padding (px-6) of the outer PageFrame — gives the
                // tier cards the same breathing rhythm against their
                // panel as the panel has against the page.
                className="flex flex-col justify-between rounded-2xl bg-cream p-6 md:p-10"
              >
                <div>
                  <p className="text-sm uppercase tracking-[0.08em] text-sage">{t.name}</p>
                  <p className="mt-5 text-h2 md:text-h2-lg">{t.amount}</p>
                  <p className="mt-5 text-body leading-relaxed text-ink/80">{t.blurb}</p>
                </div>
                {/* Fiat "Give $X" stays disabled until the every.org
                    gateway is set up — restore as <a href={...}
                    target="_blank"> when live. The ETH button is now
                    live: clicking opens a modal with the FFA wallet
                    address, QR code, and copy control (see
                    EthGiveButton). flex-nowrap with flex-1 children
                    keeps both on one row at every card width. */}
                <div className="mt-8 flex flex-nowrap gap-2">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Donation gateway coming soon"
                    className="inline-flex min-w-0 flex-1 cursor-not-allowed items-center justify-center whitespace-nowrap rounded-xl bg-ink/15 px-3 py-3 text-xs uppercase tracking-[0.08em] text-ink/40"
                  >
                    Give {t.amount.replace('+', '')}
                  </button>
                  <EthGiveButton label={ethLabel} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-sm text-muted">All tiers include recognition.</p>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Refer us</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Open a door for us.
            </h2>
          </div>
          <div className="flex flex-col text-body-lg leading-relaxed text-ink/85">
            <p>
              If you sit on a foundation board, advise a grant program, or have ties to a
              donor, fund, or competition that supports the arts, science writing, or
              future-oriented media, we&rsquo;d love an introduction. We&rsquo;re a
              501(c)(3) actively building the grant pipeline for Possibilia, the OURS
              exhibition, and the Industrial Garden initiative.
            </p>
            <p className="mt-5">
              We can prepare a tailored brief for your contact within a week. Send a name,
              an email, and a sentence about why you think it&rsquo;s a fit.
            </p>
            <div className="mt-auto pt-10">
              <Link
                href="/contact?topic=Refer a donor or foundation"
                className="btn-solid"
              >
                Make an introduction
              </Link>
            </div>
          </div>
        </div>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <h2 className="text-h2 leading-[1.05] md:text-h2-lg">Other ways to give.</h2>
        <ul className="mt-12 grid gap-12 text-body leading-relaxed text-ink/80 md:grid-cols-3">
          {OTHER_WAYS.map((w) => (
            <li key={w.label}>
              <p className="text-sm uppercase tracking-[0.08em] text-sage">{w.label}</p>
              <p className="mt-4">{w.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-sm text-muted">
          For any of the above, start with a note via{' '}
          <Link href="/contact" className="underline decoration-from-font underline-offset-4 text-ink hover:text-sage">
            our contact form
          </Link>{' '}
          and we&rsquo;ll route you to the right place.
        </p>
      </Panel>
    </>
  );
}

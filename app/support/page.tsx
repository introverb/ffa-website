import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Support',
  description:
    'Support the Foundation for Future Aesthetics — a 501(c)(3) nonprofit. Sponsor a story, an editorial package, or a full issue. All donations are tax-deductible.',
};

const TIERS = [
  {
    name: 'Patron',
    amount: '$500',
    blurb: 'Underwrite one piece — a Possibilia story, illustration, or companion essay.',
  },
  {
    name: 'Editorial Sponsor',
    amount: '$1,500',
    blurb:
      'Underwrite a full editorial package — story, artwork, and companion essay — plus listing as an event sponsor.',
  },
  {
    name: 'Founding Sponsor',
    amount: '$5,000+',
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
    body: 'Gifts of appreciated stock or cryptocurrency are often more tax-efficient than cash. Reach out for transfer instructions.',
  },
  {
    label: 'Bequests & planned giving',
    body: 'Including the foundation in your estate plans helps secure long-term funding for the work. We can provide language for your will or trust.',
  },
];

export default function SupportPage() {
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
          {TIERS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-2xl bg-cream p-10"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.08em] text-sage">{t.name}</p>
                <p className="mt-5 text-h2 md:text-h2-lg">{t.amount}</p>
                <p className="mt-5 text-body leading-relaxed text-ink/80">{t.blurb}</p>
              </div>
              <a
                href="https://www.every.org/futureaesthetics"
                target="_blank"
                rel="noreferrer"
                className="btn-solid mt-8 self-start"
              >
                Give {t.amount.replace('+', '')}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">All tiers include recognition.</p>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Refer us</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Open a door for us.
            </h2>
          </div>
          <div className="text-body-lg leading-relaxed text-ink/85">
            <p>
              If you sit on a foundation board, advise a grant program, or have ties to a
              donor, fund, or competition that supports the arts, science writing, or
              future-oriented media &mdash; we&rsquo;d love an introduction. We&rsquo;re a
              501(c)(3) actively building the grant pipeline for Possibilia, the OURS
              exhibition, and the Industrial Garden initiative.
            </p>
            <p className="mt-5">
              We can prepare a tailored brief for your contact within a week. Send a name,
              an email, and a sentence about why you think it&rsquo;s a fit.
            </p>
            <Link href="/contact" className="btn-solid mt-10 inline-block">
              Make an introduction
            </Link>
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

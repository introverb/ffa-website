import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support the Foundation for Future Aesthetics — a 501(c)(3) nonprofit. Sponsor a story, an editorial package, or a full issue. All donations are tax-deductible.',
};

const TIERS = [
  {
    name: 'Patron',
    amount: '$500',
    blurb:
      'Sponsor one piece in an editorial package — a Possibilia short story, a commissioned illustration, or a companion essay.',
  },
  {
    name: 'Editorial Sponsor',
    amount: '$1,500',
    blurb:
      'Underwrite a complete editorial package: a Possibilia story, the original artwork commissioned to accompany it, and the companion essay that grounds the fiction in real research.',
  },
  {
    name: 'Founding Sponsor',
    amount: '$5,000+',
    blurb:
      'Underwrite a full issue of Possibilia, sponsor an exhibition, or seed funding for a foundation initiative. Recognition options included.',
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

export default function DonatePage() {
  return (
    <>
      <Panel id="donate" variant="white" className="md:p-16">
        <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">
          Donate
        </p>
        <h1 className="mt-6 max-w-4xl text-h2 leading-[1.05] md:text-h2-lg">
          Become a patron of the Arts &amp; Sciences.
        </h1>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.name} className="rounded-2xl bg-cream p-10">
              <p className="text-sm uppercase tracking-[0.08em] text-sage">{t.name}</p>
              <p className="mt-5 text-h2 md:text-h2-lg">{t.amount}</p>
              <p className="mt-5 text-body leading-relaxed text-ink/80">{t.blurb}</p>
              <a
                href="https://www.every.org/futureaesthetics"
                target="_blank"
                rel="noreferrer"
                className="btn-solid mt-8 inline-block"
              >
                Give {t.amount.replace('+', '')}
              </a>
            </div>
          ))}
        </div>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Refer us</p>
            <h2 className="mt-6 text-h2 leading-[1.05] md:text-h2-lg">
              Know a fund we should know?
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

      <Panel variant="white" className="md:p-16">
        <h2 className="max-w-4xl text-h2 leading-[1.05] md:text-h2-lg">
          Fund a more optimistic future.
        </h2>
        <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-ink/80">
          The Foundation for Future Aesthetics is a 501(c)(3) nonprofit. Every dollar pays
          contributors, funds programs, and brings new work into the world. Donations are
          tax-deductible to the extent allowed by law.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#donate" className="btn-solid">
            Donate now
          </a>
          <Link href="/contact" className="btn">
            Discuss a major gift
          </Link>
        </div>
      </Panel>
    </>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support the Foundation for Future Aesthetics — a 501(c)(3) nonprofit. All donations are tax-deductible.',
};

const TIERS = [
  { name: 'Reader', amount: '$25', blurb: 'Contribute the cost of an issue. Funds page rates for one short essay or piece of artwork.' },
  { name: 'Patron', amount: '$250', blurb: 'Underwrite a feature commission, including the writer or artist’s rate plus editing.' },
  { name: 'Founding sponsor', amount: '$2,500+', blurb: 'Help launch an entire issue, fund an exhibition, or sponsor a research fellowship.' },
];

export default function DonatePage() {
  return (
    <>
      <Panel variant="white" className="md:p-20">
        <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">Support our work</p>
        <h1 className="mt-8 max-w-4xl text-h1 leading-[1.05] md:text-h1-lg">Fund a more optimistic future.</h1>
        <p className="mt-10 max-w-prose text-body-lg leading-relaxed text-ink/80">
          The Foundation for Future Aesthetics is a 501(c)(3) nonprofit. Every dollar pays
          contributors, funds research, or supports programs and exhibitions. Donations are
          tax-deductible to the extent allowed by law.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#donate" className="btn-solid">Donate now</a>
          <Link href="/contact" className="btn">Discuss a major gift</Link>
        </div>
      </Panel>

      <Panel id="donate" variant="white" className="md:p-16">
        <div className="grid gap-10 md:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.name} className="bg-cream rounded-2xl p-10">
              <p className="text-sm uppercase tracking-[0.08em] text-sage">{t.name}</p>
              <p className="mt-5 text-h2 md:text-h2-lg">{t.amount}</p>
              <p className="mt-5 text-body leading-relaxed text-ink/80">{t.blurb}</p>
              <a
                href="https://www.every.org/futureaesthetics"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block btn-solid"
              >
                Give {t.amount}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted">
          Replace the donation links above with your processor of choice.
        </p>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <h2 className="text-h2 md:text-h2-lg">Other ways to give.</h2>
        <ul className="mt-12 grid gap-12 md:grid-cols-3 text-body leading-relaxed text-ink/80">
          <li>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Donor-advised funds</p>
            <p className="mt-4">
              We accept grants from DAFs at Fidelity Charitable, Schwab, Vanguard, and others.
              Use our EIN to recommend a grant.
            </p>
          </li>
          <li>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Stock & crypto</p>
            <p className="mt-4">
              Gifts of appreciated stock or cryptocurrency may be more tax-efficient than cash.
              Get in touch for transfer instructions.
            </p>
          </li>
          <li>
            <p className="text-sm uppercase tracking-[0.08em] text-sage">Sponsor an issue</p>
            <p className="mt-4">
              Underwrite a full issue of Possibilia, an exhibition, or a research fellowship.
              Recognition options included.
            </p>
          </li>
        </ul>
      </Panel>
    </>
  );
}

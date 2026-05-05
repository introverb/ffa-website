import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support the Foundation for Future Aesthetics — a 501(c)(3) nonprofit. All donations are tax-deductible.',
};

export default function DonatePage() {
  return (
    <Panel variant="white" className="md:p-20">
      <p className="text-sm underline decoration-from-font underline-offset-4 text-muted">
        Donate
      </p>
      <h1 className="mt-8 max-w-4xl text-h1 leading-[1.05] md:text-h1-lg">
        Fund a more optimistic future.
      </h1>
      <p className="mt-10 max-w-prose text-body-lg leading-relaxed text-ink/80">
        The Foundation for Future Aesthetics is a 501(c)(3) nonprofit. Every dollar pays
        contributors and funds the programs that bring this work into the world. Donations are
        tax-deductible to the extent allowed by law.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href="https://www.every.org/futureaesthetics"
          target="_blank"
          rel="noreferrer"
          className="btn-solid"
        >
          Donate now
        </a>
        <Link href="/contact" className="btn">
          Discuss a major gift
        </Link>
      </div>
    </Panel>
  );
}

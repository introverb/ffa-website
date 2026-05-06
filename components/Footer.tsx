import Link from 'next/link';
import Image from 'next/image';
import { Panel } from './PageFrame';

const NAV = [
  { href: '/possibilia', label: 'Possibilia' },
  { href: '/contact', label: 'Contact' },
  { href: '/support', label: 'Support' },
];

// Minimal black footer panel - logo + 501c3 line on the left,
// stacked nav links on the right, X icon below.
export function Footer() {
  return (
    <Panel variant="dark" className="md:p-16">
      <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
        <div className="text-white">
          <Link href="/" className="block">
            <Image
              src="/images/logo.svg"
              alt="FFA"
              width={56}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
          <p className="mt-6 text-sm leading-relaxed">
            <Link href="/" className="underline decoration-from-font underline-offset-4">
              Foundation for Future Aesthetics
            </Link>
            <br />
            <span className="text-white/70">is a 501(c)(3) nonprofit.</span>
          </p>
          <p className="mt-4 text-xs leading-relaxed text-white/50">
            Imagery by{' '}
            <a
              href="https://www.behance.net/natist"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-from-font underline-offset-4 hover:text-white"
            >
              Seungjun Na
            </a>
            .
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 text-white md:items-end">
          <ul className="space-y-2 text-right">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-sm underline decoration-from-font underline-offset-4 hover:text-sage-light"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="https://twitter.com/possibiliamag"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter / X"
            className="mt-6 inline-block text-white/60 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </Panel>
  );
}

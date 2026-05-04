import Link from 'next/link';
import Image from 'next/image';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/possibilia', label: 'Possibilia' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur">
      <div className="container-wide flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* Drop /public/images/logo.svg to replace this circle. */}
          <span aria-hidden className="block h-9 w-9 rounded-full bg-sage" />
          <span className="text-h6 font-normal tracking-tight text-ink hidden sm:block">
            Foundation for Future Aesthetics
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-[0.12em] text-ink hover:text-sage"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/donate" className="btn-solid">
            Donate
          </Link>
        </nav>

        <Link href="/donate" className="btn-solid md:hidden">
          Donate
        </Link>
      </div>

      <nav className="container-wide flex gap-6 overflow-x-auto pb-3 md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm uppercase tracking-[0.12em] text-ink hover:text-sage"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

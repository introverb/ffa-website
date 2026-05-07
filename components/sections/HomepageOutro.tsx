import Image from 'next/image';
import Link from 'next/link';
import { Panel } from '@/components/PageFrame';

// Bottom-of-homepage Resources section. Image bleeds flush to the panel's
// left edge (Panel's overflow-hidden + rounded-3xl picks up the outer
// corners). Right column carries an eyebrow + heading and three linked
// items that point readers toward the Manifesto, the Possibilia submission
// flow, and the Donate page.
const RESOURCES = [
  {
    href: '/resources/manifesto',
    title: 'Manifesto: forging our future through optimistic science fiction',
    blurb:
      'Why we believe the stories we tell about tomorrow shape the world we actually build. The visionary case for an optimistic, realistic memetic infrastructure.',
  },
  {
    href: '/possibilia-submissions',
    title: 'Submit to Possibilia, Issue 0',
    blurb:
      'We’re commissioning fiction, nonfiction companion pieces, and original artwork. Read the guide, then send your pitch. We respond within four weeks.',
  },
  {
    href: '/support',
    title: 'Support the foundation',
    blurb:
      'Be a modern Medici — back the artists, writers, and researchers building a better century. We’re a 501(c)(3); fully tax-deductible.',
  },
];

export function HomepageOutro() {
  return (
    <Panel variant="white" full>
      <div className="grid md:min-h-[460px] md:grid-cols-[370px_1fr]">
        <div className="relative aspect-[4/5] md:aspect-auto">
          <Image
            src="/images/possibilia-submissions.png"
            alt="Possibilia submissions"
            fill
            sizes="(max-width: 768px) 100vw, 370px"
            className="object-cover"
          />
          <p className="absolute bottom-4 right-4 text-xs italic text-white/90 drop-shadow">
            Possibilia by Dylan Weiler
          </p>
        </div>
        <div className="p-8 md:p-12">
          <p className="eyebrow">Resources</p>
          <h2 className="mt-3 text-h3 leading-tight md:text-h3-lg">Where to next?</h2>

          <ul className="mt-10 space-y-8">
            {RESOURCES.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="group block">
                  <h3 className="text-h5 leading-tight group-hover:text-sage md:text-h4">
                    {r.title}
                  </h3>
                  <p className="mt-2 max-w-prose text-body leading-relaxed text-muted">
                    {r.blurb}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}

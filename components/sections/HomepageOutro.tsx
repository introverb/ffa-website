import Image from 'next/image';
import { Panel } from '@/components/PageFrame';

// Bottom-of-homepage section. Image bleeds flush to the panel's left/top/
// bottom edges; Panel's overflow-hidden + rounded-3xl clips the image's
// outer corners so they pick up the panel's corner radius (the inner edge
// where image meets right column stays square — that's the look we want).
// Right column carries its own padding for the copy that hasn't landed yet.
//
// On md+ the panel has a min height of 460px (≈1/3 taller than the image's
// natural 4:5 aspect at 280px wide). The grid's default items-stretch means
// the image cell expands to that height, so object-cover trims a little
// off the sides of the source — the composition stays centered.
// On mobile the aspect lock keeps the artwork true to its native shape.
export function HomepageOutro() {
  return (
    <Panel variant="white" full>
      <div className="grid md:min-h-[460px] md:grid-cols-[280px_1fr]">
        <div className="relative aspect-[4/5] md:aspect-auto">
          <Image
            src="/images/possibilia-submissions.png"
            alt="Possibilia submissions"
            fill
            sizes="(max-width: 768px) 100vw, 280px"
            className="object-cover"
          />
        </div>
        <div aria-hidden className="p-8 md:p-12" />
      </div>
    </Panel>
  );
}

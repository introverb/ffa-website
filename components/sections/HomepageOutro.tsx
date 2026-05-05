import Image from 'next/image';
import { Panel } from '@/components/PageFrame';

// Bottom-of-homepage section. Image bleeds flush to the panel's left/top/
// bottom edges; Panel's overflow-hidden + rounded-3xl clips the image's
// outer corners so they pick up the panel's corner radius (the inner edge
// where image meets right column stays square — that's the look we want).
// Right column carries its own padding for the copy that hasn't landed yet.
export function HomepageOutro() {
  return (
    <Panel variant="white" full>
      <div className="grid md:grid-cols-[280px_1fr] md:items-stretch">
        <div className="relative aspect-[4/5] w-full">
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

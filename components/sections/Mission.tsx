import Image from 'next/image';
import { Panel } from '@/components/PageFrame';
import { SITE } from '@/lib/content';

// Mission panel — text left, mission collage right, image bleeds flush to
// the panel's right/top/bottom edges. Same approach as HomepageOutro but
// mirrored. The 540px min-height + 450px image column line up with the
// source's natural 5:6 aspect (mission.jpg is 2000x2400) so object-cover
// has nothing to trim.
export function Mission() {
  return (
    <Panel variant="white" full>
      <div className="grid md:min-h-[540px] md:grid-cols-[1fr_450px]">
        <div className="flex flex-col justify-between p-8 md:p-12">
          <div>
            <p className="text-sm font-medium underline decoration-from-font underline-offset-4 text-muted">
              Mission
            </p>
            <h2 className="mt-8 text-h2 leading-[1.1] md:text-h2-lg">{SITE.tagline}</h2>
          </div>
          <p className="mt-10 max-w-prose text-body leading-relaxed text-muted">
            The aesthetics of the future shape the future itself. The images and stories a
            civilization circulates about its tomorrow influence what it builds, what it funds,
            and what it considers worth attempting. We exist to make better such images more
            abundant.
          </p>
        </div>
        <div className="relative aspect-[5/6] md:aspect-auto">
          <Image
            src="/images/mission.jpg"
            alt="Future-facing collage"
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            // X anchor at 10% biases the visible region ~50px left of center
            // (when the row stretches past 540 to fit the text). Tunable —
            // lower % pans further left, 50% is centered.
            className="object-cover md:object-[10%_50%]"
          />
        </div>
      </div>
    </Panel>
  );
}

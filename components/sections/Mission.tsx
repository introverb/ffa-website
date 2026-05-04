import { Panel } from '@/components/PageFrame';
import { Placeholder } from '@/components/Placeholder';
import { SITE } from '@/lib/content';

// Mission panel — left text, right collage image, 50/50.
export function Mission() {
  return (
    <Panel variant="white" className="md:p-20">
      <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-stretch">
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium underline decoration-from-font underline-offset-4 text-muted">
              Mission
            </p>
            <h2 className="mt-8 text-h2 leading-[1.1] md:text-h2-lg">
              {SITE.tagline}
            </h2>
          </div>
          <p className="mt-10 max-w-prose text-body leading-relaxed text-muted">
            The aesthetics of the future shape the future itself. The images and stories a
            civilization circulates about its tomorrow influence what it builds, what it funds,
            and what it considers worth attempting. We exist to make better such images more
            abundant.
          </p>
        </div>
        <div className="self-stretch">
          {/* Drop /public/images/mission.jpg (portrait, ~3:4) to replace the placeholder */}
          <Placeholder src="/images/mission.jpg" alt="Future-facing collage" ratio="3/4" className="h-full" />
        </div>
      </div>
    </Panel>
  );
}

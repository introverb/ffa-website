import { Panel } from '@/components/PageFrame';
import { Placeholder } from '@/components/Placeholder';

// Bottom-of-homepage section. Mirrors the way Initiatives renders an image:
// Placeholder gives the rounded-md / overflow-hidden / object-cover treatment,
// and the image sits in its own column on the left. Right column reserved
// for copy that hasn't been written yet.
export function HomepageOutro() {
  return (
    <Panel variant="white" className="md:p-12">
      <div className="grid gap-10 md:grid-cols-[280px_1fr] md:items-center">
        <Placeholder
          src="/images/possibilia-submissions.png"
          alt="Possibilia submissions"
          ratio="square"
        />
        <div aria-hidden />
      </div>
    </Panel>
  );
}

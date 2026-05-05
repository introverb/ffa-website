import Image from 'next/image';
import { Panel } from '@/components/PageFrame';

// Bottom-of-homepage section — left column carries the Possibilia submissions
// artwork (contained, not cropped — rounded corners are on the container so
// the corners clip without distorting the image inside). Right column is
// reserved for copy that hasn't been written yet.
export function HomepageOutro() {
  return (
    <Panel variant="white" className="md:p-12">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="relative h-[240px] overflow-hidden rounded-md md:h-[280px]">
          <Image
            src="/images/possibilia-submissions.png"
            alt="Possibilia submissions"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
        <div aria-hidden />
      </div>
    </Panel>
  );
}

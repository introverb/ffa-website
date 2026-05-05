import { Hero } from '@/components/sections/Hero';
import { Mission } from '@/components/sections/Mission';
import { MagazineCallout } from '@/components/sections/MagazineCallout';
import { Initiatives } from '@/components/sections/Initiatives';
import { HomepageOutro } from '@/components/sections/HomepageOutro';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Mission />
      <MagazineCallout />
      {/* Initiatives renders both its header (sticky) and the sliding cards
          inside one container, so everything shares the same sticky context. */}
      <Initiatives />
      <HomepageOutro />
    </>
  );
}

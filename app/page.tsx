import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { Mission } from '@/components/sections/Mission';
import { MagazineCallout } from '@/components/sections/MagazineCallout';
import { Initiatives } from '@/components/sections/Initiatives';
import { HomepageOutro } from '@/components/sections/HomepageOutro';

// Homepage inherits title + description + OG image from the layout's
// site-level metadata defaults (which describe FFA-as-a-whole, exactly
// what a search result for the bare domain should display). Only the
// canonical URL needs setting here so search engines don't index the
// homepage under both `/` and any incidental query-param variants.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

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

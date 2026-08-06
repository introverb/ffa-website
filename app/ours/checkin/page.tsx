import type { Metadata } from 'next';
import { OursCheckInKiosk } from '@/components/OursCheckInKiosk';

// Door check-in kiosk — unlisted on purpose, same reasoning as
// /ours/collect: not linked from SiteNav or the sitemap, reachable
// only by whoever opens this exact URL on the check-in iPad.
// PageFrame/ConditionalFooter both special-case this route to render
// chromeless (no nav, no footer) — see their CHROMELESS_ROUTES /
// HIDE_FOOTER_ROUTES lists.
export const metadata: Metadata = {
  title: 'Check In · OURS',
  robots: { index: false, follow: false },
};

export default function OursCheckInPage() {
  return <OursCheckInKiosk />;
}

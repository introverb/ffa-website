import type { Metadata } from 'next';
import { OursCheckInForm } from '@/components/OursCheckInForm';

// Door check-in — reached by scanning the /q/checkin QR code at the
// door on a guest's own phone, for anyone who didn't register on
// Luma. Unlisted on purpose, same reasoning as /ours/collect: not
// linked from SiteNav or the sitemap, reachable only via that QR/URL.
// PageFrame/ConditionalFooter both special-case this route to render
// chromeless (no nav, no footer) — see their CHROMELESS_ROUTES /
// HIDE_FOOTER_ROUTES lists.
export const metadata: Metadata = {
  title: 'Check In · OURS',
  robots: { index: false, follow: false },
};

export default function OursCheckInPage() {
  return <OursCheckInForm />;
}

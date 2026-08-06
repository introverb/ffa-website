'use client';

import { usePathname } from 'next/navigation';

// Hides the footer on specific routes: the OURS collect success page
// (a focused "thank you" moment shouldn't end in a full site footer),
// and the door check-in page (chromeless end to end — see PageFrame's
// CHROMELESS_ROUTES for the matching nav half of this). Footer stays a
// server component; it's passed in as a prop so this client wrapper
// never has to import it directly.
const HIDE_FOOTER_ROUTES = ['/ours/collect/success', '/ours/checkin'];

export function ConditionalFooter({ footer }: { footer: React.ReactNode }) {
  const pathname = usePathname();
  const hide = HIDE_FOOTER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );
  if (hide) return null;
  return <>{footer}</>;
}

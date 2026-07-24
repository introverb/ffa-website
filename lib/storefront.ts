// OURS storefront — data model + roster for /ours/collect.
//
// Source of truth: FFA_Master.xlsx (Exhibition tab for physical works;
// the Web3 Wall tab drives the page's Ledgerworks section). Entries are
// transcribed close to verbatim rather than polished, so it's easy to
// diff against the sheet and correct — get the info in, refine later.
// Where the sheet says "TBD" / "placeholder" / "see notes", the field
// is left unset here rather than guessed; the card shows "Price TBD"
// and holds the Buy button until a real number lands.

export type ArtworkStatus = 'available' | 'reserved' | 'sold';

export interface Artwork {
  id: string;
  title: string;
  artistName: string;
  /** From the placard copy doc's medium line. */
  medium?: string;
  /**
   * One-line credit/provenance note from the placard copy (commission
   * credits, donation terms) — the distilled version, not the blurb.
   */
  note?: string;
  /**
   * Longer-form text for the Ledgerworks detail modal — distinct from
   * the one-line `note`. Only rendered there, never on the compact
   * card. Unset = the modal just falls back to `note`.
   */
  description?: string;
  /**
   * Flexible spec rows for the Ledgerworks detail modal (size, paper,
   * frame, edition, etc.) — varies enough piece to piece that a
   * label/value list beats fixed fields. Unset or empty = no spec
   * table shown.
   */
  details?: Array<{ label: string; value: string }>;
  /** 100% of this goes to the artist. Unset = not priced yet ("Price TBD"). */
  artistPrice?: number;
  /**
   * Buyer-facing final price, for works where the sheet fixes the sale
   * number itself ("$3,200 final", "no +20%", "20% incl.") rather than
   * an artist price to add the premium on top of. Overrides the
   * artistPrice × 1.2 calculation.
   */
  listPrice?: number;
  /** True when the sheet flags a price as approximate/not final (e.g. "TBD ~$3,200"). */
  priceIsEstimate?: boolean;
  /**
   * ETH-only sale (decimal string, e.g. "0.3") — set when a piece
   * sells directly for ETH to FFA's wallet instead of through Stripe
   * (no USD option, no card checkout). Mutually exclusive with
   * artistPrice/listPrice in practice: displayPrice() only looks at
   * the USD fields, so an ethPrice piece shows no USD price anywhere.
   * FFA buys the piece up front and resells it, so payment goes
   * straight to FFA's wallet rather than through an artist payout.
   */
  ethPrice?: string;
  status: ArtworkStatus;
  isNFT?: boolean;
  /** Set for limited editions sold as "any of N" (e.g. Lupi's 5 prints); omit for 1-of-1s — including a single numbered piece from an edition elsewhere, like Anyanwu's 1/5. */
  editionSize?: number;
  /** How many of an edition have sold. Only meaningful with editionSize. */
  unitsSold?: number;
  /** Path under /public once a real photo exists; undefined = gray block. */
  image?: string;
  /** The photo's real pixel dimensions — lets the card size to the
   *  image's own aspect ratio instead of a uniform cropped box. Required
   *  alongside `image` (next/image needs intrinsic dimensions without
   *  `fill`). Run scripts/optimize-images.mjs on new photos first, then
   *  read the final width/height from its output. */
  imageWidth?: number;
  imageHeight?: number;
  /**
   * Path under /public to a looping video of the piece — Ledgerworks
   * only. Renders in place of the still image on both the grid card
   * and the detail modal (muted/autoplay/loop); `image` still doubles
   * as the video's poster frame while it loads.
   */
  video?: string;
}

// The foundation keeps 20% of every sale as a charitable premium; the
// artist is paid their full listed price. Kept as a single constant so
// the rate only has to change in one place if it ever does.
export const PREMIUM_RATE = 0.2;

export function displayPrice(artwork: Artwork): number | null {
  if (artwork.listPrice != null) return artwork.listPrice;
  if (artwork.artistPrice == null) return null;
  return Math.round(artwork.artistPrice * (1 + PREMIUM_RATE));
}

// True once nothing is left to buy: a sold 1-of-1, or an edition with
// no units remaining. Editions and 1-of-1s use different signals
// (unitsSold vs. status) so this is the one place that reconciles them.
export function isSoldOut(artwork: Artwork): boolean {
  if (artwork.editionSize != null) {
    return (artwork.unitsSold ?? 0) >= artwork.editionSize;
  }
  return artwork.status === 'sold';
}

export function statusLabel(artwork: Artwork): 'Sold out' | 'Sold' | 'Reserved' | null {
  if (isSoldOut(artwork)) return artwork.editionSize != null ? 'Sold out' : 'Sold';
  if (artwork.status === 'reserved') return 'Reserved';
  return null;
}

// Merges the static catalog entry with whatever the live store (Redis,
// driven by the Stripe webhook) knows right now. The static `status`/
// `unitsSold` in ARTWORKS below are just the starting point — once a
// sale or reservation happens, the live store is authoritative.
function mergeLiveState(
  artwork: Artwork,
  live: { sold?: boolean; reserved?: boolean; unitsSold?: number } | undefined,
): Artwork {
  if (!live) return artwork;
  return {
    ...artwork,
    status: live.sold ? 'sold' : live.reserved ? 'reserved' : artwork.status,
    unitsSold: live.unitsSold ?? artwork.unitsSold,
  };
}

// The page's read path: static catalog + live overrides, merged. Kept
// here (rather than in the page component) so both the page and the
// checkout route can ask "what does this artwork look like right now?"
// the same way.
export async function getArtworksForDisplay(): Promise<Artwork[]> {
  const { getLiveStates } = await import('./storefront-store');
  const liveStates = await getLiveStates(ARTWORKS.map((a) => a.id));
  return ARTWORKS.map((a) => mergeLiveState(a, liveStates[a.id]));
}

export const ARTWORKS: Artwork[] = [
  {
    id: 'rero-a-new-city-will-be-built',
    // Title as the work itself renders it (all caps, trailing
    // ellipsis) — see the placard copy doc.
    title: 'A NEW CITY WILL BE BUILT…',
    artistName: 'RERO',
    medium: 'Burnt wood, metal, 67 × 49 in',
    note: 'Commissioned for OURS',
    // Updated final price, sold — was $26,000, available.
    listPrice: 30000,
    status: 'sold',
    image: '/images/storefront/rero-a-new-city-will-be-built.jpg',
    imageWidth: 2000,
    imageHeight: 1449,
  },
  {
    id: 'anyanwu-pyramid',
    // One specific numbered piece (1 of a 5-piece edition elsewhere),
    // not "any of 5 available" like Lupi's, so no editionSize here —
    // the edition number lives in the medium line instead.
    title: 'PYRAMID',
    artistName: 'Anyanwu',
    medium: 'Hand-painted 3D print sculpture, 12 × 12 × 12 in · edition 1/5',
    note: 'Commissioned for OURS',
    // Confirmed against the printed program: $6,000 flat, no +20%
    // premium on top (supersedes the earlier "$7,200 final" reading).
    listPrice: 6000,
    status: 'available',
    image: '/images/storefront/anyanwu-pyramid.png',
    imageWidth: 1535,
    imageHeight: 1024,
  },
  {
    id: 'giorgia-lupi-02-blue-prints',
    // The wall piece is an original (on loan) — what's for sale here
    // is a limited archival print of it, made explicit in the medium
    // so nobody mistakes this for the original. Prints fulfil
    // post-event.
    title: '02 Blue',
    artistName: 'Giorgia Lupi',
    medium: 'Archival print, 14 × 18 in, edition of 25, unframed',
    note: 'Original (gouache, acrylic, ink, and threads on paper) on loan to OURS. Signed certificate of authenticity included.',
    editionSize: 25,
    unitsSold: 0,
    status: 'available',
    // Updated final price, per print. FFA and the artist split the
    // proceeds 50/50 — an internal settlement detail, not reflected on
    // the page. Was $400.
    listPrice: 650,
    image: '/images/storefront/giorgia-lupi-02-blue-prints.jpeg',
    imageWidth: 1046,
    imageHeight: 1358,
  },
  {
    id: 'dylan-weiler-possibilia',
    title: 'Possibilia',
    artistName: 'Dylan Weiler',
    medium: 'Oil on canvas, 24 × 36 in',
    note: 'Donated by the artist — 100% of proceeds go to FFA',
    // Updated final price, donated — 100% to FFA, no +20%. Was $3,200.
    listPrice: 3800,
    status: 'available',
    image: '/images/storefront/dylan-weiler-possibilia.png',
    imageWidth: 808,
    imageHeight: 1009,
  },
  {
    id: 'seungjun-na-printed-collage',
    title: 'Paradise of Rumors',
    artistName: 'Seungjun Na',
    medium: 'Digital collage, 36 × 48 in',
    note: 'Commissioned by Medici Magazine for OURS',
    listPrice: 4200,
    status: 'available',
    image: '/images/storefront/seungjun-na-paradise-of-rumors.jpg',
    imageWidth: 2000,
    imageHeight: 2667,
  },
  {
    id: 'denis-pakowacz-magnetobiology',
    title: 'Magnetobiology',
    artistName: 'Denis Pakowacz',
    medium: 'Prints, unframed · edition of 5 · 6 × 8 in',
    note: 'Commissioned by Leverage for OURS',
    // $340 per set. Leverage keeps 1 of the 5 free — editionSize is set
    // to the 4 actually for sale (not shown on the card), so it grays
    // out once those 4 are gone rather than at 5. Was a single $5,600
    // sold lot; restructured to sell individually.
    listPrice: 340,
    editionSize: 4,
    unitsSold: 0,
    status: 'available',
  },
  {
    id: 'sue-ellen-zhang-oil-painting',
    title: 'The Hummingbird',
    artistName: 'Sue Ellen Zhang',
    medium: 'Oil on canvas, 30 × 40 in',
    // Confirmed against the printed program: $4,600 final. Was $4,800.
    listPrice: 4600,
    status: 'available',
    image: '/images/storefront/sue-ellen-zhang-oil-painting.jpeg',
    imageWidth: 2000,
    imageHeight: 1500,
  },
  {
    id: 'ellynne-dec-glass-bead-piece',
    title: 'the illusion of control',
    artistName: 'Ellynne Dec',
    medium: 'Woven glass beads, 12 × 12 × 0.5 in',
    // Confirmed final price from Ellynne's piece info sheet. Was $8,800.
    listPrice: 8000,
    status: 'available',
    image: '/images/storefront/ellynne-dec-glass-bead-piece.png',
    imageWidth: 795,
    imageHeight: 721,
  },
  {
    id: 'vanessa-rosa-little-martian-dreamer',
    title: 'Little Martian, the Dreamer',
    artistName: 'Vanessa Rosa',
    medium: 'Ceramic and glass, 2 × 2 × 3 in',
    listPrice: 825,
    status: 'available',
    image: '/images/storefront/vanessa-rosa-little-martian-dreamer.jpg',
    imageWidth: 1024,
    imageHeight: 1017,
  },
  {
    id: 'olli-payne-nucleonics',
    title: 'Materia Alchemical',
    artistName: 'Olli Payne',
    medium: 'Prints, unframed · edition of 10 · 28 × 9 in',
    note: 'Materials donated by the Nucleonics Institute — 100% of proceeds go to FFA',
    // $180 per piece. Olli keeps 1 of the 10 free — editionSize is set
    // to the 9 actually for sale (not shown on the card), so it grays
    // out once those 9 are gone rather than at 10. Was a single $1,800
    // piece.
    listPrice: 180,
    editionSize: 9,
    unitsSold: 0,
    status: 'available',
    image: '/images/storefront/olli-payne-nucleonics.jpg',
    imageWidth: 2000,
    imageHeight: 669,
  },
  // Ledgerworks (on-chain) pieces that FFA sells directly, same as the
  // physical works above: buyer pays through Stripe (20% premium
  // included), FFA transfers the NFT afterward — the wallet-address
  // field + "confirmation before transfer" copy on the checkout route
  // is what isNFT: true turns on. This is the model in the program and
  // in the artists' contracts. Ledgerworks pieces that collect through
  // an external route instead (e.g. Nahuel Aquiles' personalized mints
  // via genpi.org) stay out of this catalog — they're listed directly
  // in the page's Ledgerworks section.
  {
    id: 'mauricio-pommella-the-pope',
    title: 'The Pope',
    artistName: 'Mauricio Pommella',
    medium: 'Digital 1/1, on-chain',
    isNFT: true,
    status: 'available',
    image: '/images/storefront/mauricio-pommella-the-pope.jpg',
    imageWidth: 2000,
    imageHeight: 3556,
    video: '/images/storefront/mauricio-pommella-the-pope.mp4',
    // ETH only, no USD/Stripe — FFA bought the piece up front and is
    // reselling it, so payment goes straight to FFA's wallet. Olli may
    // make a special in-person USD exception at the show; if so he'll
    // flag it live rather than this being a site-configurable option.
    ethPrice: '0.3',
  },
  {
    id: 'yura-miron-solara-plaza',
    title: 'Solara Plaza',
    artistName: 'Yura Miron',
    medium: 'Digital work, on-chain',
    note: 'Includes a physical print from the exhibition',
    isNFT: true,
    status: 'available',
    image: '/images/storefront/yura-miron-solara-plaza.jpg',
    imageWidth: 1711,
    imageHeight: 2500,
    listPrice: 350,
  },
  {
    id: 'anjoladave-an-ending-a-beginning',
    title: 'An Ending, A Beginning',
    artistName: 'AnjolaDave',
    medium: 'Digital work, on-chain',
    note: 'Includes a 20 × 25 in physical print in the exhibition',
    isNFT: true,
    status: 'available',
    image: '/images/storefront/anjoladave-an-ending-a-beginning.jpg',
    imageWidth: 2000,
    imageHeight: 2500,
    // Final price, set by the artist.
    listPrice: 960,
  },
  // Recycle Group's "Forest of Expired Links" moved OUT of this
  // catalog and back to an external-link card (see LEDGERWORKS_WORKS
  // in app/ours/collect/page.tsx) — terms with Gazelli Art House are
  // still being negotiated (who nets what of the 20% premium), so it
  // isn't sold through FFA's own checkout for now.
];

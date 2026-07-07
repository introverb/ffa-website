// OURS storefront — data model + roster for /ours/collect.
//
// Source of truth: FFA_Master.xlsx (Exhibition tab for physical works;
// the Web3 Wall tab drives the page's Web3 section). Entries are
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
  /** Only set where it adds real clarity beyond the title (the sheet has no medium column). */
  medium?: string;
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
  status: ArtworkStatus;
  isNFT?: boolean;
  /** Set for limited editions sold as "any of N" (e.g. Lupi's 5 prints); omit for 1-of-1s — including a single numbered piece from an edition elsewhere, like Anyanwu's 1/5. */
  editionSize?: number;
  /** How many of an edition have sold. Only meaningful with editionSize. */
  unitsSold?: number;
  /** Path under /public once a real photo exists; undefined = gray block. */
  image?: string;
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
    title: 'A New City Will Be Built',
    artistName: 'RERO',
    // Sheet: FOR SALE $26,000, "red dot when sold" — supersedes the
    // earlier sold-in-kind note. Commissioned for OURS.
    listPrice: 26000,
    status: 'available',
  },
  {
    id: 'anyanwu-pyramid',
    // Qty 1 in the sheet — this is one specific numbered piece (1 of a
    // 5-piece edition elsewhere), not "any of 5 available" like
    // Lupi's, so no editionSize here.
    title: 'PYRAMID (ed. 1/5)',
    artistName: 'Anyanwu',
    // Sheet: "$7,200 final", terms "Edition +20%" — the 7,200 already
    // includes the premium ($6,000 to the artist).
    artistPrice: 6000,
    status: 'available',
  },
  {
    id: 'giorgia-lupi-02-blue-prints',
    // The wall piece is an original (on loan) — what's for sale here
    // is a limited archival print of it, made explicit in the medium
    // so nobody mistakes this for the original. Prints fulfil
    // post-event. Price still TBD in the sheet.
    title: '02 Blue (prints)',
    artistName: 'Giorgia Lupi',
    medium: 'Archival print, edition of 5',
    editionSize: 5,
    unitsSold: 0,
    status: 'available',
  },
  {
    id: 'dylan-weiler-possibilia',
    title: 'Possibilia (oil)',
    artistName: 'Dylan Weiler',
    // Sheet: "$3,200 (final)", donated — 100% to FFA, no +20%.
    listPrice: 3200,
    status: 'available',
  },
  {
    id: 'seungjun-na-printed-collage',
    title: 'printed collage',
    artistName: 'Seungjun Na',
    // Sheet: "$3,200 final (20% incl.)".
    listPrice: 3200,
    status: 'available',
  },
  {
    id: 'denis-pakowacz-magnetobiology',
    // Prints hang at OURS; the hand-made originals are what sold.
    // Sheet: "originals SOLD (mark on website)".
    title: 'Magnetobiology (×5)',
    artistName: 'Denis Pakowacz',
    status: 'sold',
  },
  {
    id: 'sue-ellen-zhang-oil-painting',
    title: 'The Hummingbird',
    artistName: 'Sue Ellen Zhang',
    medium: 'Oil on canvas, 30 × 40 in',
    // Sheet: "For sale (+20%)" — no artist price yet.
    status: 'available',
  },
  {
    id: 'ellynne-dec-glass-bead-piece',
    title: 'glass-bead piece',
    artistName: 'Ellynne Dec',
    // Sheet: "For sale (TBD +20%)".
    status: 'available',
  },
  {
    id: 'olli-payne-nucleonics',
    title: 'Nucleonics (framed metal)',
    artistName: 'Olli Payne',
    // Sheet: "$1,800 (final)", no +20% — replaces the old ~$3,200
    // estimate.
    listPrice: 1800,
    status: 'available',
  },
  // Web3 Wall works (Pommella's "The Pope", etc.) are listed in the
  // page's Web3 section, not here — they collect on-chain or via
  // external routes, not through the Stripe checkout.
];

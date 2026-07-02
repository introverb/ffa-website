// OURS storefront — data model + roster for /ours/collect.
//
// REAL DATA, confirmed piece-by-piece as it's shared — this file grows
// as more artists' pieces come in. Where a fact (price, title) isn't
// confirmed yet, the field is left unset rather than guessed; the card
// shows "Price TBD" and holds the Buy button until it's filled in.

export type ArtworkStatus = 'available' | 'reserved' | 'sold';

export interface Artwork {
  id: string;
  title: string;
  artistName: string;
  medium: string;
  /** 100% of this goes to the artist. Unset = not priced yet ("Price TBD"). */
  artistPrice?: number;
  status: ArtworkStatus;
  isNFT?: boolean;
  /** Set for limited editions (e.g. prints); omit for 1-of-1 originals. */
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

export const ARTWORKS: Artwork[] = [
  {
    id: 'rero',
    title: 'Piece details pending',
    artistName: 'RERO',
    medium: 'Details pending',
    status: 'sold', // sold in-kind
  },
  {
    id: 'giorgia-lupi-02-blue-print',
    // The wall piece itself is an original, one-of-a-kind — what's for
    // sale here is a limited archival print of it, made explicit in
    // both the title and medium so nobody mistakes this for the
    // original.
    title: '02 Blue — Archival Print',
    artistName: 'Giorgia Lupi',
    medium: 'Archival print, edition of 5',
    editionSize: 5,
    unitsSold: 0,
    status: 'available',
  },
  {
    id: 'mauricio-pommella',
    title: 'Piece details pending',
    artistName: 'Mauricio Pommella',
    medium: 'Details pending',
    status: 'available',
    isNFT: true,
  },
];

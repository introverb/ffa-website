// OURS storefront — data model + roster for /ours/collect.
//
// PLACEHOLDER DATA: the entries below are stand-ins (generic titles,
// round prices) so the grid, states, and layout can be reviewed before
// the real lineup lands. Swap them for the confirmed rows from the
// Sales Log tab once that's shared — nothing else needs to change.
//
// `image` is left undefined on every placeholder on purpose: ArtworkCard
// falls back to a neutral gray block when it's unset. Once real photos
// are dropped into /public/images/storefront/, set each entry's `image`
// to that path and the card swaps to the real photo automatically.

export type ArtworkStatus = 'available' | 'reserved' | 'sold';

export interface Artwork {
  id: string;
  title: string;
  artistName: string;
  medium: string;
  /** 100% of this goes to the artist. */
  artistPrice: number;
  status: ArtworkStatus;
  isNFT?: boolean;
  /** Set for limited editions (e.g. "Edition of 5"); omit for 1-of-1s. */
  editionSize?: number;
  /** Path under /public once a real photo exists; undefined = gray block. */
  image?: string;
}

// The foundation keeps 20% of every sale as a charitable premium; the
// artist is paid their full listed price. Kept as a single constant so
// the rate only has to change in one place if it ever does.
export const PREMIUM_RATE = 0.2;

export function displayPrice(artwork: Artwork): number {
  return Math.round(artwork.artistPrice * (1 + PREMIUM_RATE));
}

export const ARTWORKS: Artwork[] = [
  {
    id: 'placeholder-1',
    title: 'Untitled Study I',
    artistName: 'Artist Name',
    medium: 'Mixed media on panel',
    artistPrice: 800,
    status: 'available',
  },
  {
    id: 'placeholder-2',
    title: 'Untitled Study II',
    artistName: 'Artist Name',
    medium: 'Archival print',
    artistPrice: 450,
    status: 'available',
    editionSize: 5,
  },
  {
    id: 'placeholder-3',
    title: 'Untitled Study III',
    artistName: 'Artist Name',
    medium: 'Oil on canvas',
    artistPrice: 1200,
    status: 'sold',
  },
  {
    id: 'placeholder-4',
    title: 'Untitled Study IV',
    artistName: 'Artist Name',
    medium: 'Generative video, on-chain',
    artistPrice: 950,
    status: 'available',
    isNFT: true,
  },
  {
    id: 'placeholder-5',
    title: 'Untitled Study V',
    artistName: 'Artist Name',
    medium: 'Sculpture, bronze',
    artistPrice: 2200,
    status: 'available',
  },
  {
    id: 'placeholder-6',
    title: 'Untitled Study VI',
    artistName: 'Artist Name',
    medium: 'Ink on paper',
    artistPrice: 600,
    status: 'reserved',
  },
];

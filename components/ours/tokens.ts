// OURS design tokens, lifted verbatim from the printed program's
// stylesheet (Materials/Program/OURS_Program_PRINT.html :root). Using
// the same palette + type roles on the web page makes the page read as
// the program come to life rather than a separate design.
export const OURS = {
  orange: '#E8651A',
  ink: '#282828',
  cream: '#F0EEEB',
  blue: '#7A9AAC',
  green: '#506450',
  gray: '#646464',
  hair: '#C8C3BA',
} as const;

export type SectionId =
  | 'about'
  | 'gallery'
  | 'ledgerworks'
  | 'visions'
  | 'systems'
  | 'thanks';

export type Section = {
  id: SectionId;
  /** Two-digit index shown in the mono kicker. */
  index: string;
  title: string;
  /** Short line shown collapsed — the hook. */
  teaser: string;
  /** Longer description shown at the top of the expanded panel. */
  blurb: string;
  image: string;
  /** CSS object-position for the slat image. Slats are tall and narrow
   *  at rest and narrower still as ribs, so a centered cover-crop lands
   *  arbitrarily; this points the crop at the part of the photo that
   *  should survive. Defaults to center. */
  imagePosition?: string;
  /** Separate object-position for the 76px rib state. A crop that works
   *  at the resting width often loses its subject entirely once the slat
   *  narrows, so ribs get their own framing. Falls back to imagePosition. */
  imagePositionRib?: string;
};

// NOTE: teaser/blurb copy below is placeholder — written to be
// plausible and to size the layout correctly. Replace with final copy.
export const SECTIONS: Section[] = [
  {
    id: 'about',
    index: '01',
    title: 'About the Event',
    teaser: 'The manifesto at the door, the talks, and the program itself.',
    blurb:
      'A night for positive visions of the future: the manifesto that met people at the door, the talks that set the room alight, and the program as it was handed to you.',
    image: '/images/ours/header.jpg',
    imagePosition: '50% 45%',
  },
  {
    id: 'gallery',
    index: '02',
    title: 'Gallery',
    teaser: 'The works on the walls — and the ones still available.',
    blurb:
      'A curated roster of original works, hung salon-style. Each piece carries its wall placard, its artist statement, and — for the works still available — its price.',
    image: '/images/ours/gallery.jpg',
    // AP8_3107. Dead-centre is deliberate: at the resting slat width the
    // two faces sit centred with the green triangle piece in the wall
    // space above them, and a centred crop is also the most stable as the
    // slat narrows to a rib or opens up.
    imagePosition: '50% 50%',
    imagePositionRib: '38% 50%', // rib pulls left onto the green triangle piece
  },
  {
    id: 'ledgerworks',
    index: '03',
    title: 'Ledgerworks',
    teaser: 'A wall of onchain work, rebuilt piece by piece.',
    blurb:
      'The Ledgerworks wall gathered artists working natively onchain. Click any piece to step up to it the way you would have in the room.',
    image: '/images/ours/ledgerworks.jpg',
    imagePosition: '50% 50%',
  },
  {
    id: 'visions',
    index: '04',
    title: 'Visions of the Future',
    teaser: 'What the people building it actually see coming.',
    blurb:
      'We asked technologists, artists and researchers a single question about the future and let the answers run on a loop, one after another, all evening.',
    image: '/images/ours/visions.jpg',
    imagePosition: '50% 50%',
  },
  {
    id: 'systems',
    index: '05',
    title: 'Systems of Power',
    teaser: 'A pyramid, a rulebook, and a game you can still play.',
    blurb:
      'Anyanwu’s Systems of Power turned the mechanics of hierarchy into an object and a playable game. The blueprints and rules are here; so is the invitation to play.',
    image: '/images/ours/pyramid.jpg',
    imagePosition: '50% 50%',
  },
  {
    id: 'thanks',
    index: '06',
    title: 'The Future is OURS',
    teaser: 'Everyone who made it, and where we go next.',
    blurb:
      'OURS happened because a lot of people said yes. Here is every one of them — and the next thing we are building.',
    image: '/images/ours/thanks.jpg',
    // AP8_4671. Erika sits well left of centre, so the crop is pulled
    // left to keep her in frame even at the 76px rib width — a centred
    // crop here would show nothing but the RERO panel behind her.
    imagePosition: '18% 50%',
    imagePositionRib: '24% 50%', // rib sits on the right half of Erika's face
  },
];


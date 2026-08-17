// Central content for the site. Swap in your final copy and image paths here.
// Images go in /public/images/ - reference them as "/images/filename.jpg".

export const SITE = {
  name: 'Foundation for Future Aesthetics',
  short: 'FFA',
  tagline:
    'The Foundation for Future Aesthetics curates, promotes, and supports optimistic and realistic visions of the future expressed through the arts and sciences.',
  twitter: 'https://twitter.com/possibiliamag',
};

export const INITIATIVES = [
  {
    n: '01',
    title: 'OURS: Exhibition & Salon',
    status: 'August 2026 · Lower East Side, NYC',
    // Invites are out and the guest list + artist roster are both
    // closed for this run — no more "Attend"/"Submit Artwork" CTAs
    // here or on /ours until a future edition reopens them.
    blurb:
      'A one-night exhibition and salon in New York that puts speculative artwork on the walls and the people building it into reality at the lectern. Scientists, philosophers, artists, and builders give short provocations. Original work hangs around them, available to take home. Guests from a broad spectrum of fields fill the spaces between, because the future is shaped by everyone. Lower East Side, NYC. August 2026.',
    image: '/images/initiative-exhibitions.jpg',
    href: '/ours',
  },
  {
    n: '02',
    title: 'Possibilia Magazine',
    status: 'In Development · Issue 0',
    note: 'Submissions are open!',
    noteHref: '/possibilia-submissions',
    blurb:
      'Possibilia is the foundation’s literary magazine. Original short fiction set in believable, recognizably better tomorrows, paired with companion essays by working scientists and original artwork commissioned for each piece. We publish in print and online, and we commission the writers, artists, and researchers telling the stories that will shape and inspire our reality.',
    image: '/images/initiative-possibilia.jpg',
    href: '/possibilia',
  },
  {
    n: '03',
    title: 'Eucatastrophe',
    status: 'In Development · Research Tool',
    blurb:
      'A free tool for anyone who’s lost the plot on the future. Doomerism is easy and everywhere; hope is harder, because it has to be earned. Eucatastrophe generates grounded visions of a better tomorrow, building each scenario on a chain of real evidence and putting it through expert scrutiny before it sees the light of your screen. Every hopeful claim arrives cited, checked, and defensible. It’s a place to come when the headlines have you convinced it’s all downhill: proof, not platitudes, that better futures are still on the table.',
    image: '/images/contact.jpg',
    // Not linked anywhere — the tool isn't public yet and this card
    // shouldn't be clickable at all.
  },
  {
    n: '04',
    title: 'Industrial Garden',
    status: 'Summer 2027 · Proposal Exhibit',
    blurb:
      'A gallery-style mixed-medium art exhibit of design plans for Industrial Garden, the foundation’s proposed maker space in New York City. The space pairs local craftspeople with hard-tech founders, sharing professional-grade equipment and workspace under a self-sustaining model that subsidizes the smaller side from the heavier. We’re seeking founding funders to back the venture from the exhibit forward into reality.',
    image: '/images/initiative-garden.jpg',
    href: '/contact',
  },
];

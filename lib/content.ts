// Central content for the site. Swap in your final copy and image paths here.
// Images go in /public/images/ - reference them as "/images/filename.jpg".

export const SITE = {
  name: 'Foundation for Future Aesthetics',
  short: 'FFA',
  tagline:
    'The Foundation for Future Aesthetics curates, promotes, and supports optimistic and realistic visions of the future expressed through the arts and sciences.',
  twitter: 'https://twitter.com/possibiliamag',
};

// Stories aren't featured on the live homepage - kept here so the resources
// page and dynamic /resources/[slug] route still have something to render.
// The Manifesto lives at its own dedicated route, so it isn't in this list.
export const STORIES = [
  {
    slug: 'submit-to-possibilia',
    title: 'How to submit work to Possibilia Magazine',
    date: '2024-07-09',
    author: 'Olli Payne',
    excerpt:
      'A practical guide for writers and artists who want to contribute to our debut issue: what we publish, how to format submissions, and what we pay.',
    image: '/images/story-submit.jpg',
  },
];

// Titles match the live site exactly. Blurbs are paraphrased - replace with
// your final copy when ready.
export const RESEARCH_AREAS = [
  {
    n: '01',
    title: 'History of Science Fiction',
    blurb:
      'Tracing the lineage of speculative storytelling and the futures each generation imagined for itself.',
  },
  {
    n: '02',
    title: 'Unconventional Storytelling',
    blurb:
      'Form, structure, and medium experiments that expand how a future can be rendered on the page or screen.',
  },
  {
    n: '03',
    title: 'TBD: Researchers Wanted',
    blurb: 'Have an idea for us to peruse/pursue? Want to do a case study with us?',
    cta: { label: 'Drop us a line!' },
  },
];

// Projects exist on the Possibilia page only - not on the live homepage.
export const PROJECTS = [
  {
    title: 'Silverstone Community Center',
    image: '/images/project-silverstone.jpg',
    href: '/possibilia',
  },
  {
    title: '234 Kingsway Road',
    image: '/images/project-kingsway.jpg',
    href: '/possibilia',
  },
  {
    title: 'Smith Park Botanical Gardens',
    image: '/images/project-smithpark.jpg',
    href: '/possibilia',
  },
  {
    title: 'NYLN Inc. HQ',
    image: '/images/project-nyln.jpg',
    href: '/possibilia',
  },
];

export const INITIATIVES = [
  {
    n: '01',
    title: 'Possibilia Magazine',
    status: 'In Development · Issue 0',
    note: 'Submissions are open!',
    noteHref: '/possibilia-submissions',
    blurb:
      'Possibilia is the foundation’s literary magazine. Original short fiction set in believable, recognizably better tomorrows, paired with companion essays by working scientists and original artwork commissioned for each piece. We publish in print and online, we pay professional rates, and we commission the writers, artists, and researchers building the canon the next generation of writers and scientists will read.',
    image: '/images/initiative-possibilia.jpg',
    href: '/possibilia',
  },
  {
    n: '02',
    title: 'OURS: Exhibition & Salon',
    status: 'August 2026',
    blurb:
      'A one-night exhibition and salon in New York that puts speculative artwork on the walls and the people building it into reality at the lectern. Scientists, philosophers, artists, and builders give short provocations. Original work hangs around them, available to take home. Guests from a broad spectrum of fields fill the spaces between, because the future is shaped by everyone. SOMMWHERE, NYC. August 2026.',
    image: '/images/initiative-exhibitions.jpg',
    href: '/ours',
  },
  {
    n: '03',
    title: 'Industrial Garden',
    status: 'Summer 2027 · Proposal Exhibit',
    blurb:
      'A gallery-style mixed-medium art exhibit of design plans for Industrial Garden, the foundation’s proposed maker space in New York City. The space pairs local craftspeople with hard-tech founders, sharing professional-grade equipment and workspace under a self-sustaining model that subsidizes the smaller side from the heavier. We’re seeking founding funders to back the venture from the exhibit forward into reality.',
    image: '/images/initiative-garden.jpg',
    href: '/contact',
  },
];

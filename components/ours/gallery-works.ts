// Gallery data — the 11 works, their placard copy, and their hand-authored
// scatter positions. Copy is transcribed verbatim from the printed placards.
// This file is meant to be edited: swap images, adjust copy, nudge positions.
//
// pos / posTablet: { x, y } are fractions of the scatter field (0..1, centre
// of the work), scale is 0.45–1.0 (desktop) / 0.6–1.0 (tablet) — larger reads
// nearer — and z stacks overlaps. Positions are composed by hand, not
// randomised: nudge them like you'd nudge a hang, and check the resting
// state as a still image after every change.

export type WorkPanel = {
  heading: string;
  paragraphs: string[];
  /** render every paragraph as an italic quote */
  quote?: boolean;
  /** render paragraphs from this index onward in italic */
  italicFrom?: number;
  link?: { href: string; label: string };
};

export type ScatterPos = {
  /** horizontal centre, fraction of field width */
  x: number;
  /** vertical centre, fraction of field height */
  y: number;
  /** relative presence, 0.45–1.0; larger = nearer */
  scale: number;
  /** stacking order where works overlap */
  z: number;
};

export type Work = {
  slug: string;
  artist: string;
  title?: string;
  medium: string[];
  price?: string;
  /** intrinsic width / height of the image file */
  aspect: number;
  /** real description of the image, not a filename */
  alt: string;
  /** eager-load the few works visible on first paint */
  eager?: boolean;
  /** dissolve the bottom ~5% of the image into pixel dust */
  dustBottom?: boolean;
  /** matching Artwork id in lib/storefront.ts — wires the Buy button
   *  to the storefront's Stripe checkout. Unset = not for sale. */
  storeId?: string;
  pos: ScatterPos;
  posTablet: ScatterPos;
  panels: WorkPanel[];
};

export const WORKS: Work[] = [
  {
    slug: 'rero', artist: 'RERO', title: 'A New City Will Be Built…',
    medium: ['Burnt wood, metal'], price: '$30,000',
    aspect: 1.35,
    alt: 'Weathered assemblage of burnt wood and metal carrying the phrase “A NEW CITY WILL BE BUILT…” in struck-through capitals.',
    eager: true,
    storeId: 'rero-a-new-city-will-be-built',
    pos: { x: 0.42, y: 0.31, scale: 1.0, z: 9 },
    posTablet: { x: 0.44, y: 0.31, scale: 1.0, z: 9 },
    panels: [
      {
        heading: 'About the work',
        paragraphs: [
          'RERO’s work is built upon a unique visual grammar: the use of the Verdana font (a symbol of the digital era), systematically crossed out with a horizontal line. This act of erasure does not seek to obliterate, but to interrogate. It questions the limits of language and the contradictions of our time and his practice.',
          'Driven by punchlines and aphorisms, the betrayal of images, and semantic wordplay, RERO’s work lies at the crossroads of urban practices, land art, and conceptual gestures. By striking through the aphorism of a triumphant modernity — “A NEW CITY WILL BE BUILT…” — RERO performs a poetic and conceptual act of resistance. This top-down promise of a fully planned city, dictated by technocratic imperatives, is challenged here — suspended by erasure without being entirely canceled out.',
        ],
      },
      {
        heading: 'From the commissioner — A New City Will Be Built…',
        paragraphs: [
          'Individually, human beings carve their way through the unknown in a process called “life.” When living nearby to one another, their paths criss-cross and coalesce. They come to have a shared destiny. As more people live in closer proximity, the gravitational force of their shared experience, their suffering and wonder, produces a unique culture. This unique culture defines a city, each one a world unto itself.',
          'Giving birth to a city is giving birth to a new world.',
          'The cultures of cities across the world speak and communication, but they do not merge. The people within the cities are too closely related to one another and too far from everyone else. The network of cities metabolizes everything new humanity encounters and reflects the future as it is discovered. But what will the future hold?',
          'The future will involve decentralized governance, a culture of privacy and transparency, accessible elites, energy self-reliance, awe-inspiring architecture, human-friendly transportation, and schools that inculcate diverse values. It will be bursting at the seams with new ideas and art, love and passion, and the will to conquer the universe while displaying humility in the presence of God and the spirits.',
          'Since this future cannot be incorporated into the network of existing cultures defined by present-day cities, we reach an inescapable conclusion.',
          '— Unnamed',
        ],
      },
    ],
  },
  {
    slug: 'anyanwu', artist: 'Anyanwu', title: 'Pyramid',
    medium: ['Sculpture + interactive game · edition 1/5', 'Commissioned for OURS'], price: '$6,000',
    aspect: 1.5,
    alt: 'Stepped pyramid sculpture with tiered levels, photographed against a dark ground.',
    storeId: 'anyanwu-pyramid',
    pos: { x: 0.7, y: 0.74, scale: 0.78, z: 6 },
    posTablet: { x: 0.66, y: 0.74, scale: 0.84, z: 6 },
    panels: [
      {
        heading: 'About the work',
        paragraphs: [
          'This sculpture reimagines the pyramid as a contemporary African structure of knowledge. Education here is more than schooling: language, memory, science, spirituality, storytelling, governance, imagination. Through Spirit Fiction, African knowledge systems appear as living forces shaping future institutions — asking what education might have become had Africa’s evolution not been interrupted. Each level: growth, responsibility, knowledge passed between generations. Without knowledge, power becomes empty. With knowledge, power becomes responsibility.',
        ],
        link: { href: 'https://weareanyanwu.com', label: 'Anyanwu' },
      },
      {
        heading: 'Artist vision',
        paragraphs: [
          '“My vision is an Africa that remembers itself fully and builds from that memory with confidence. Knowledge must become responsibility. Power must become care. Culture must become infrastructure. Imagination must become a civic tool. An Africa that does not simply survive the future, but authors it.”',
        ],
        quote: true,
      },
    ],
  },
  {
    slug: 'vanessa', artist: 'Vanessa Rosa', title: 'Little Martian, the Dreamer',
    medium: ['Ceramic and glass · 3 × 3 × 3 in · unique, 1/1'], price: '$825',
    aspect: 0.62,
    alt: 'Small ceramic head with melted glass pooling over it, caught mid-liquefaction.',
    storeId: 'vanessa-rosa-little-martian-dreamer',
    pos: { x: 0.12, y: 0.27, scale: 0.45, z: 4 },
    posTablet: { x: 0.2, y: 0.27, scale: 0.6, z: 4 },
    panels: [
      {
        heading: 'About the work',
        paragraphs: [
          'Dreamer is from 2021, the artist’s first experiment fusing melted glass with ceramic; the head appears to be liquefying, caught mid-transformation.',
          'In the Little Martians universe, heads are seeds. Rather than sending spaceships carrying humans to other planets, life spreads through these seeds: ceramic exoskeletons that draw on whatever local energy they find and carry Earth’s biological and cultural inheritance with them.',
          'Dreamer has not yet germinated. It is still waiting for a host, someone invited to co-create the universe it belongs to.',
        ],
        link: { href: 'https://littlemartians.world', label: 'Vanessa’s portfolio' },
      },
      {
        heading: 'Artist vision',
        paragraphs: [
          '“I envision the future with my hands. The Little Martians began in clay, in 2020, at Mars College, an off-grid experimental community in the California desert. I was making characters without knowing who they were, and they told me over time.',
          'Mars College runs on solar power, scarce water, AI applied for human autonomy, an extitution instead of an institution. When you build your own life support from the ground up, you start to see how contingent our current form really is.',
          'So I began imagining a much more distant future and my characters work as a guide to my present. They come from an organic Mars, where Earth’s life has evolved so far beyond what we are now that we would struggle to recognize it as our descendant, even though it carries everything we were. That is what these seeds hold.”',
        ],
        quote: true,
      },
    ],
  },
  {
    slug: 'sev', artist: 'Sev Gedra', title: 'O Quam Cito',
    medium: ['Garment', 'On loan — not for sale'],
    aspect: 0.5,
    alt: 'Life-sized faceless figure wrapped in inherited household linen, woven amber cascading from the face and pooling at the feet.',
    dustBottom: true,
    pos: { x: 0.78, y: 0.44, scale: 0.9, z: 7 },
    posTablet: { x: 0.72, y: 0.44, scale: 0.93, z: 7 },
    panels: [
      {
        heading: 'About the work',
        paragraphs: [
          'O Quam Cito is a life-sized figure wrapped in inherited household linen encrusted in woven amber that cascades from the face and pools at the feet. The linen is the most intimate material I could find: domestic, inherited, private. It becomes the ground beneath the legendary. The title translates roughly: oh how quickly fame fades. The figure is faceless because legends have no single author — stories woven strand by strand, hand to hand, each retelling adding something, the origin receding. The piece speaks the dialect of awe without naming any tradition. That gap is where the viewer gets to live.',
        ],
        link: { href: 'https://sevgedramakes.com', label: 'Sev’s work' },
      },
      {
        heading: 'Artist vision',
        paragraphs: [
          '“We have no future worth creating without the sources from the past that we wish to venerate. Craft is a direct generational connection to the past, and passing that knowledge on is our through line to the future. I don’t believe in god, but I absolutely believe in legacy. Legacy is life after death. This piece was made with the past, in conversation with the dead, and left deliberately open for whoever comes next. The amber carries what we valued. The gaps in the weave hold space for future generations.”',
        ],
        quote: true,
      },
    ],
  },
  {
    slug: 'giorgia', artist: 'Giorgia Lupi', title: 'Modelli Circolari · 02 Blue',
    medium: ['Data art; gouache, acrylic, ink, and threads on paper and tracing paper', '18 × 14 in'],
    price: 'Original on loan · prints $650 (edition of 25)',
    aspect: 0.81,
    alt: 'Hand-drawn circular data map in blue gouache and ink — an inner focus circle of symbols, diagrams, and threads on layered paper.',
    storeId: 'giorgia-lupi-02-blue-prints',
    pos: { x: 0.15, y: 0.47, scale: 0.68, z: 5 },
    posTablet: { x: 0.23, y: 0.47, scale: 0.77, z: 5 },
    panels: [
      {
        heading: 'About the work',
        paragraphs: [
          'Blue is part of a series called Modelli Circolari, and they stem from my obsession with the things I am eager to understand or fascinated by. Each piece has an inner focus circle that hosts symbols, connections, diagrams and words. 02 Blue maps the hidden structure of personal identity and its evolution: how a self is built, layered, and revised over time. What I cannot yet express in language I can lay down on paper and keep looking at.',
        ],
        link: { href: 'https://giorgialupi.com', label: 'Giorgia’s work' },
      },
      {
        heading: 'Artist vision',
        paragraphs: [
          '“I believe the larger, collective problems we face can only be approached once we fully understand ourselves inside, and therefore one another as human beings. So my vision of a positive future starts small and close: people who stay curious about their own inner workings, and technology that helps us see ourselves more clearly instead of flattening us into averages. Meaning tends to arrive sideways, and I want us to leave room for that.”',
        ],
        quote: true,
      },
    ],
  },
  {
    slug: 'ellynne', artist: 'Ellynne Dec', title: 'the illusion of control',
    medium: ['Woven glass beads'], price: '$8,000',
    aspect: 1.04,
    alt: 'Triangular wall hanging of woven glass beads, rows recording the steps of a cellular automaton.',
    eager: true,
    storeId: 'ellynne-dec-glass-bead-piece',
    pos: { x: 0.6, y: 0.1, scale: 0.55, z: 2 },
    posTablet: { x: 0.58, y: 0.1, scale: 0.67, z: 2 },
    panels: [
      {
        heading: 'About the work',
        paragraphs: [
          'Illusion of Control is an early work in an ongoing series of triangular wall hangings that translate fundamental computational processes into patterns of woven glass beads. As in a cellular automaton, each bead corresponds to a cell, and each row records another step in the application of a simple local rule.',
          'Made to travel and be rehung, the work serves as a portable point of return for the computationally minded nomad — the same rule held constant as its surrounding context changes. Its central tension is precise: knowing the rule is not the same as foreseeing the form.',
        ],
        link: { href: 'https://ellynne.studio', label: 'Ellynne’s studio' },
      },
      {
        heading: 'Artist vision',
        paragraphs: [
          '“Humans and technology are all computationally bounded in many ways. This is the ultimate shared suffering. The only way to really find out what the future is like is to ‘perform the calculations’ and experience its evolution. For human ‘observers like us’, understanding is a way of minimizing suffering.',
          'In the future, we will become sensitive to new kinds of patterns, using our enhanced collective ability to ‘step back’ in perspective and perceive wider patterns in the broad landscape of time, space, and the human-conceptual landscape.',
          'Without true novelty, artificial intelligences are at risk of becoming calcified in local basins of attraction. After LLMs fully consume cultural archives, human creativity will be prized by AI as the only ‘true’ source of the novel. True human creativity and our ability to generate productive mistakes will be more valuable than data.”',
        ],
        quote: true,
      },
    ],
  },
  {
    slug: 'sue', artist: 'Sue Ellen Zhang', title: 'The Hummingbird',
    medium: ['Oil on canvas', '30 × 40 in'], price: '$4,600',
    aspect: 0.76,
    alt: 'Oil painting of a hummingbird in motion, its energy carried through soft organic sweeps of colour.',
    eager: true,
    storeId: 'sue-ellen-zhang-oil-painting',
    pos: { x: 0.85, y: 0.17, scale: 0.72, z: 5 },
    posTablet: { x: 0.78, y: 0.17, scale: 0.8, z: 5 },
    panels: [
      {
        heading: 'About the work',
        paragraphs: [
          'The Hummingbird draws from the Futurist movement’s fascination with speed, motion, and technological progress. I wanted to translate that sense of energy through softer, organic forms inspired by the natural world. The painting imagines a future in which technology and nature are not opposing forces, but systems capable of evolving together. Its movement suggests both possibility and the responsibility to shape progress with care.',
        ],
        link: { href: 'https://zhangsueellen.com', label: 'Sue Ellen’s portfolio' },
      },
      {
        heading: 'Artist vision',
        paragraphs: [
          '“I imagine a positive future in which advancing technology allows people to devote more time to their unique creativity, curiosity, and talents. Through continued experimentation and iteration, I believe we can create technologies that are both sustainable and deeply human-centered. Progress is not inevitable on its own; it is shaped by the values and intentions we bring to it. It is our responsibility to ensure that technology strengthens our humanity rather than replacing it.”',
        ],
        quote: true,
      },
    ],
  },
  {
    slug: 'seungjun', artist: 'Seungjun Na', title: 'Paradise of Rumors',
    medium: ['Digital collage', '36 × 48 in · unique exhibition print', 'Commissioned by Medici Magazine for OURS'],
    price: '$4,200',
    aspect: 0.8,
    alt: 'Digital collage of a secluded pond: on a floating lotus leaf with a sail, children build structures out of LEGO bricks.',
    storeId: 'seungjun-na-printed-collage',
    pos: { x: 0.47, y: 0.58, scale: 0.8, z: 6 },
    posTablet: { x: 0.48, y: 0.58, scale: 0.85, z: 6 },
    panels: [
      {
        heading: 'About the work',
        paragraphs: [
          'This piece is meant to evoke the feeling of discovering another small world hidden within a secluded pond surrounded by lush plants. On a lotus leaf floating in the pond, there is a miniature world where children are building structures made of LEGO bricks, representing technology built upon art and science. The lotus leaf also has a sail. It symbolizes the hope that everyone on it is moving together toward the same destination with a shared purpose.',
          'The patron does not appear directly in the image. Instead, they are represented by the viewer’s perspective: quietly observing from a distance, never interfering, protecting this small world without disturbing it, and returning from time to time with genuine care and curiosity to see how it has grown.',
          '“I chose children as the main characters because I believe that people who still retain a childlike sense of curiosity and innocence are often the ones capable of imagining groundbreaking changes and truly original ideas. I look forward to a future where such ideas open the door to entirely new worlds.”',
        ],
        italicFrom: 2,
        link: { href: 'https://instagram.com/na_tist', label: 'Seungjun’s portfolio' },
      },
      {
        heading: 'From the commissioner — Medici Magazine',
        paragraphs: [
          'Technology depends on science and art. Science makes discoveries, while art produces the culture which will accept or reject the technology. Short-sighted societies harvest the gains from culture and discoveries already produced, while long-sighted ones act as patrons, planting and tending the seeds of the art and science of the future.',
          'The Medici of Florence built and maintained a polity for centuries by converting prosperity into scientific and cultural advancement. Brunelleschi’s dome rose over the cathedral. Ficino founded the Platonic Academy, Michelangelo created Battle of the Centaurs under their roof, and Galileo found the moons of Jupiter and named them in their honor. These were products of skill backed by capital and taste, and all of humanity benefitted as a result.',
          'Medici Magazine takes up that inheritance, and its first commission, Paradise of Rumors, reflects that: a hidden pond where children raise a small civilization out of art and science, tenderly watched by an unseen patron who facilitates and stewards the most important work our era can produce.',
        ],
        link: { href: 'https://medicimag.com', label: 'Medici Magazine' },
      },
    ],
  },
  {
    slug: 'denis', artist: 'Denis Pakowacz', title: 'Magnetobiology',
    medium: ['Five works on paper · watercolor + penwork · A5 each', 'Commissioned by Leverage for OURS'],
    price: 'Edition of 5 · prints $340 each',
    aspect: 2.88,
    alt: 'Row of five A5 watercolor-and-ink works on paper exploring magnetism in living systems, in intricate black linework and colour.',
    storeId: 'denis-pakowacz-magnetobiology',
    pos: { x: 0.48, y: 0.9, scale: 0.88, z: 7 },
    posTablet: { x: 0.48, y: 0.9, scale: 0.91, z: 7 },
    panels: [
      {
        heading: 'About the artist',
        paragraphs: [
          'Denis Pakowacz is an artist and illustrator creating highly detailed work inspired by dark art, sci-fi, fantasy, and mythology. He works across traditional and digital media, including pixel art, but favors traditional black-and-white and color ink graphics: intricate details and clean linework, a medium for illustrations that tell a story. In his process, he chooses to follow a strict traditional academic standard: he gathers references, meticulously studies textual and visual materials, and makes numerous rough sketches to find the right composition, values, and object relationships, then refines line and tone until the drawing comes alive.',
        ],
        link: { href: 'https://behance.net/pakowacz', label: 'Denis’s portfolio' },
      },
      {
        heading: 'From the commissioner — Leverage',
        paragraphs: [
          'Magnetic effects are widespread in living systems. At a minimum, magnetic fields provide a source of noise cells and organisms need to detect and neutralize. Scientists have focused especially on the possibility that animals, such as birds and sharks, use magnetic fields to navigate.',
          'More likely, however, is that magnetism is one of the missing pieces needed to explain how life arises, sustains itself, and replicates. Decoding this mystery will require investigating quantum and emergent phenomena, two topics scientists have largely ceded to non-scientific parties.',
          'In the future, biology will incorporate an understanding of magnetism alongside others causes, yielding a more complete picture of life as well as advanced health practices and interventions rarely contemplated today.',
          'Leverage is a New York-based non-profit that supports revolutionary science.',
        ],
        link: { href: 'https://leverage.institute', label: 'Leverage' },
      },
    ],
  },
  {
    slug: 'materia', artist: 'Olli Payne', title: 'Materia Alchemical',
    medium: ['Test sample visualization & materials exhibit', 'Materials donated by the Nucleonics Institute'],
    price: 'Prints $180 each (edition of 10)',
    aspect: 2.17,
    alt: 'Palladium lattice sample tiles arranged into an imperfect lattice, colourless structure bending into bursts of energetic colour.',
    eager: true,
    storeId: 'olli-payne-nucleonics',
    pos: { x: 0.22, y: 0.1, scale: 0.62, z: 3 },
    posTablet: { x: 0.28, y: 0.1, scale: 0.72, z: 3 },
    panels: [
      {
        heading: 'About the work',
        paragraphs: [
          'Olli Payne is an artist, futurist, and optimist who believes in the potential of using creative media to inspire curiosity and discovery.',
          'Materia Alchemical portrays modern artifacts of today’s version of the hunt for the mythic Philosopher’s stone, now informed by science. The experiment pumps deuterium into a palladium lattice, relying on microscopic imperfections in the lattice to create traps that force the hydrogen atoms close together. The expectation is that under the right conditions, these structural defects will cause the atoms to merge safely into helium and release radiation-free energy.',
          'The piece presents palladium lattice sample tiles used in experiments by the Nucleonics Institute, themselves arranged into an imperfect lattice wherein rigid and colorless structure bends, allowing for the brilliant emergence of new and energetic color.',
        ],
        link: { href: 'https://olli.vision', label: 'Olli’s portfolio' },
      },
      {
        heading: 'From the commissioner — Nucleonics Institute',
        paragraphs: [
          'Nuclear science has, to date, engineered around nuclear reactions, not engineered the reactions themselves. Nucleonics is the idea that nuclear reaction rates and products can be engineered in much the same way that quantum physics enables precise control of electrons in electronics. Achieving deliberate control of nuclear reactions would allow small-scale nuclear devices with little to no radiation byproducts, more reminiscent of modern semiconductors than conventional reactors.',
          'In this project, researchers attempt to quantum mechanically couple nuclei of hydrogen isotopes to nuclei of a host material, such as a metal lattice, to redistribute nuclear energy among them. In some configurations, this would effectively represent an acceleration of fusion rates to observable levels at temperatures far below those used in today’s plasma-based fusion reactors.',
          'The print shows a collection of optical and scanning electron micrographs produced as part of the project. It includes images of metal foils before and after loading with hydrogen, as well as polycarbonate detector plates used to record the presence of high-energy charged particles and neutrons expected to be produced in some of the experiments.',
        ],
        link: { href: 'https://nucleonics.org', label: 'Nucleonics Institute' },
      },
    ],
  },
  {
    slug: 'dylan', artist: 'Dylan Weiler', title: 'Possibilia',
    medium: ['Oil on canvas', '36 × 24 in', 'Commissioned by Possibilia Magazine'],
    price: '$3,800 · 100% of proceeds go to FFA',
    aspect: 0.69,
    alt: 'Oil painting of figures in a narrative scene, one wearing a reflective chrome jacket — the cover of Possibilia Magazine.',
    storeId: 'dylan-weiler-possibilia',
    pos: { x: 0.22, y: 0.72, scale: 0.85, z: 8 },
    posTablet: { x: 0.28, y: 0.72, scale: 0.89, z: 8 },
    panels: [
      {
        heading: 'About the artist',
        paragraphs: [
          'Dylan Evans Weiler is a painter whose work centers on narrative painting built into full installation environments, often folding in sound, environment design, and interaction, frequently in collaboration with his brother, the musician and visual artist Morgan Evans-Weiler. Sourcing tangible materials he can see, feel, and keep close is central to his process. For Possibilia, that meant pulling the materiality presented in the chrome jacket on one of the subjects from a fanny pack found thrifting which inspired this garment in the scene.',
        ],
        link: { href: 'https://dylanevansweiler.com', label: 'Dylan’s portfolio' },
      },
      {
        heading: 'Possibilia Magazine',
        paragraphs: [
          'Possibilia is the Foundation’s magazine initiative: a home for optimistic, realistic science fiction — original short stories, nonfiction companions from working scientists, and commissioned artwork. This painting is its cover.',
        ],
        link: { href: '/possibilia', label: 'Get the first print issue' },
      },
    ],
  },
];

import Image from 'next/image';
import type { Metadata } from 'next';
import { Panel } from '@/components/PageFrame';
import { JsonLd } from '@/components/JsonLd';
import { renderWithArtistLinks } from '@/lib/artists';

const MANIFESTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Manifesto: forging our future through optimistic science fiction',
  description:
    'Why we believe the stories we tell about tomorrow shape the world we actually build, and how an optimistic, realistic aesthetic can reset the canon.',
  publisher: {
    '@type': 'NonprofitOrganization',
    name: 'Foundation for Future Aesthetics',
    logo: {
      '@type': 'ImageObject',
      url: 'https://futureaesthetics.foundation/images/logo.png',
    },
  },
  image: 'https://futureaesthetics.foundation/images/manifesto.jpg',
  inLanguage: 'en-US',
};

export const metadata: Metadata = {
  title: 'Manifesto: forging our future through optimistic science fiction',
  description:
    'Why we believe the stories we tell about tomorrow shape the world we actually build, and how an optimistic, realistic aesthetic can reset the canon.',
  alternates: { canonical: '/resources/manifesto' },
  openGraph: {
    type: 'article',
    images: [{ url: '/images/manifesto.jpg', alt: 'Manifesto' }],
  },
  twitter: { images: ['/images/manifesto.jpg'] },
};

export default function ManifestoPage() {
  return (
    <Panel variant="white" full>
      <JsonLd data={MANIFESTO_SCHEMA} />
      <div className="relative aspect-[5/2]">
        <Image
          src="/images/manifesto.jpg"
          alt="Manifesto banner"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="p-8 md:p-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-[0.08em] text-sage">
            By {renderWithArtistLinks('Olli Payne')}
          </p>
          <h1 className="mt-4 text-h2 leading-tight md:text-h2-lg">
            Manifesto: forging our future through optimistic science fiction
          </h1>

          <article className="mt-14 text-body-lg leading-relaxed text-ink/90">
            <p>
              We stand at a crossroads of human history, our path forward shrouded in
              uncertainty and fraught with challenges. Yet, in this moment of global
              transformation, we have neglected one of our most powerful tools for shaping the
              future: storytelling.
            </p>
            <p className="mt-6">
              At this critical time in history, when technology has shown vast and incredible
              potential to create and destroy, we have allowed our cultural narratives to be
              dominated by dystopian visions and apocalyptic fears. This pervasive pessimism is
              not merely entertainment; it is a self-fulfilling prophecy that threatens
              to undermine our collective will to overcome the obstacles we face.
            </p>
            <p className="mt-6">
              It&rsquo;s time to reclaim the power of narrative and harness it for the
              betterment of humanity. We call for a revolution in storytelling, one that will
              ignite the imagination of millions and chart a course towards the tomorrow that
              we truly aspire to. It&rsquo;s time to popularize optimistic, realistic science
              fiction.
            </p>

            <h2 className="mt-16 text-h3 leading-tight md:text-h3-lg">
              The Impact of Science Fiction
            </h2>
            <p className="mt-8">
              Throughout history, the relationship between science fiction and technological
              advancement has been a powerful force for progress. Far from mere entertainment,
              speculative narratives have consistently served as inspiration and motivation for
              scientists, engineers, and innovators.
            </p>
            <p className="mt-6">Consider these profound impacts:</p>
            <ul className="mt-6 ml-6 list-disc space-y-3 marker:text-sage">
              <li>
                <strong>Communication Technologies:</strong> Arthur C. Clarke&rsquo;s concept
                of geostationary satellites for global communication, first proposed in a 1945
                paper, became reality less than two decades later. The flip phones in
                &ldquo;Star Trek&rdquo; and scenes from Ray Bradbury&rsquo;s{' '}
                <em>Fahrenheit 451</em> inspired the design of early mobile devices, while
                video calling, predicted in numerous sci-fi works, is now commonplace.
              </li>
              <li>
                <strong>Space Exploration:</strong> The rocket designs of &ldquo;Destination
                Moon&rdquo; (1950) influenced the Apollo program. Astronauts like Buzz Aldrin
                have cited science fiction as a key inspiration for their careers. More
                recently, Elon Musk&rsquo;s SpaceX program draws direct inspiration from the
                works of Isaac Asimov.
              </li>
              <li>
                <strong>Computing and AI:</strong> William Gibson&rsquo;s <em>Neuromancer</em>{' '}
                popularized the concept of cyberspace, influencing the development of the
                internet. The ethical considerations of artificial intelligence, explored in
                countless sci-fi narratives, now shape real-world AI development policies.
              </li>
              <li>
                <strong>Medical Advancements:</strong> Star Trek&rsquo;s medical tricorder
                inspired the development of handheld diagnostic devices. The &ldquo;Fantastic
                Voyage&rdquo; concept of miniaturized medical intervention has driven research
                into nanorobotics for healthcare.
              </li>
              <li>
                <strong>Environmental Solutions:</strong> Sci-fi explorations of climate change
                and environmental disaster have galvanized research into renewable energy,
                geoengineering, and sustainable urban design.
              </li>
            </ul>
            <p className="mt-8">
              This &ldquo;catalyst effect&rdquo; operates through several mechanisms:
            </p>
            <ul className="mt-6 ml-6 list-disc space-y-3 marker:text-sage">
              <li>
                <strong>Inspiration:</strong> Sci-fi sparks the imagination of future
                scientists and engineers from a young age, shaping career choices and research
                interests.
              </li>
              <li>
                <strong>Conceptualization:</strong> By vividly depicting potential
                technologies, sci-fi helps researchers envision end goals and potential
                applications for their work.
              </li>
              <li>
                <strong>Ethical Exploration:</strong> Fictional scenarios allow us to grapple
                with the moral implications of new technologies before they become reality,
                informing responsible development.
              </li>
              <li>
                <strong>Problem-Solving:</strong> The &ldquo;wouldn&rsquo;t it be cool
                if&rdquo; factor of sci-fi often leads to creative solutions for real-world
                challenges.
              </li>
              <li>
                <strong>Public Engagement:</strong> Compelling narratives can generate public
                interest and support for scientific endeavors, influencing funding and policy
                decisions.
              </li>
            </ul>
            <p className="mt-8">
              We assert that optimistic, scientifically grounded science fiction is not merely
              predictive; it is prescriptive. By envisioning positive futures, we create
              roadmaps for their realization. As we face unprecedented global challenges, the
              role of inspirational sci-fi in driving innovation becomes more crucial than
              ever.
            </p>

            <h2 className="mt-16 text-h3 leading-tight md:text-h3-lg">
              The Imperative of Optimism
            </h2>
            <p className="mt-8">
              Our world is filled with brilliant minds and groundbreaking innovations, yet our
              fiction often fails to reflect this reality, instead wallowing in visions of
              decline and disaster. This imbalance must be corrected. Optimism is not
              naivety; it is a powerful force for change.
            </p>
            <p className="mt-6">
              We need stories that acknowledge our challenges while showcasing our capacity to
              overcome them. These narratives should inspire hope and foster resilience in the
              face of adversity, galvanizing action by presenting achievable pathways to
              positive change. By celebrating human ingenuity and our ability to adapt to new
              circumstances, we can explore the potential for technology and innovation to
              solve global problems. This approach doesn&rsquo;t mean ignoring the very real
              issues we face, but rather framing them as obstacles to be overcome through
              creativity, collaboration, and perseverance.
            </p>
            <p className="mt-6">
              By rekindling our collective sense of possibility, we can diffuse the paralyzing
              effects of defeatism and apathy. Optimistic narratives are not just
              entertainment; they are blueprints for the future we aspire to build. They serve as
              catalysts for innovation, sparking the imagination of scientists, policymakers,
              and citizens alike. When we envision a better world, we take the first step
              toward creating it. Through stories that balance hope with realism, we can
              inspire a new generation to tackle our greatest challenges with enthusiasm and
              determination.
            </p>
            <p className="mt-6">
              It&rsquo;s important to note that our call for optimistic science fiction is not
              a push for utopian narratives. Utopias, with their portrayal of perfect
              societies, often lack the tension and conflict necessary for compelling
              storytelling and fail to address the complex realities of human nature. Instead,
              we advocate for stories that depict progress and hope while acknowledging
              ongoing challenges and the continuous work required to build a better world.
              These narratives should show societies striving towards improvement, grappling
              with ethical dilemmas, and navigating the unforeseen consequences of their
              advancements. By presenting futures that are aspirational yet imperfect, we
              create more relatable and actionable visions.
            </p>
            <p className="mt-6">
              In embracing optimism, we reclaim agency over our future. We shift from passive
              observers of a seemingly inevitable decline to active participants in shaping a
              world of possibility. This mindset is crucial as we face unprecedented global
              challenges. By fostering a culture of optimism, we cultivate the resilience and
              innovative spirit necessary to overcome obstacles and create lasting, positive
              change.
            </p>

            <h2 className="mt-16 text-h3 leading-tight md:text-h3-lg">
              Bridging Imagination and Reality
            </h2>
            <p className="mt-8">
              The chasm between scientific advancement and public understanding grows wider by
              the day. Optimistic science fiction can serve as a vital bridge, translating
              complex concepts into compelling human stories.
            </p>
            <p className="mt-6">
              We must expand our understanding of technology to encompass social innovations.
              Social structures, governance systems, and economic models are forms of
              technology that can be intentionally designed and improved. By exploring how
              changes in social technology can affect global challenges and enhance human
              flourishing, we can imagine new forms of social organization that leverage
              emerging capabilities to create more just and equitable societies.
            </p>
            <p className="mt-6">
              We should also acknowledge that technology shapes society. Science fiction
              should depict the complex interplay between technological advancements and
              social change, exploring both intended and unintended consequences on
              individuals, groups, and society as a whole. By illustrating how societal values
              and power structures influence the development and deployment of technologies,
              and showing how individuals and communities respond and adapt to technologies in
              unexpected ways, we can paint more nuanced pictures of our potential futures.
            </p>
            <p className="mt-6">
              To ground these explorations in plausibility, we encourage writers and creators
              to study current technological trends and extrapolate their potential future
              developments. By consulting experts, understanding historical examples of how
              past innovations have transformed society, and considering interdisciplinary
              impacts, storytellers can craft more credible and thought-provoking narratives.
              Exploring the concept of adjacent possibilities, innovations that become
              feasible once certain technological thresholds are crossed, can further
              enrich these visions of the future.
            </p>
            <p className="mt-6">
              The successful communication of these ideas will require an unprecedented
              collaboration between artists, scientists, thinkers, and futurists. Together,
              they can craft visions of the future that are both aspirational and grounded in
              scientific possibility.
            </p>

            <h2 className="mt-16 text-h3 leading-tight md:text-h3-lg">
              Reclaiming the Future
            </h2>
            <p className="mt-8">
              For too long, we have allowed a handful of tech moguls and Silicon Valley
              startups to monopolize our vision of tomorrow. They have churned out a culture
              divided between degrowth and acceleration, both acting as dangerous and
              polarizing ideologies. Their largest outputs have connected the world and proven
              a path to innovation, but have also subverted our agency and neglected our
              individuality and personhood. It&rsquo;s time to democratize futurism.
            </p>
            <p className="mt-6">
              This monopolization of our future vision has led to a narrowing of possibilities
              in the public imagination. The dichotomy between degrowth and acceleration
              presents a false choice, ignoring the vast spectrum of potential futures that
              lie between and beyond these extremes. By allowing these limited perspectives to
              dominate, we risk overlooking innovative solutions and alternative paths forward
              that could address the challenges that we face in more nuanced and effective
              ways.
            </p>
            <p className="mt-6">
              It&rsquo;s time to pluralize, to create a landscape of possibilities, so that we
              can become informed and inspired enough to choose our future. This pluralization
              involves not just imagining different technological futures, but also diverse
              social, economic, and political systems that could arise alongside or in
              response to these advancements. By expanding the range of futures we consider
              possible, we empower individuals and communities to actively participate in
              shaping the world they want to live in.
            </p>

            <h2 className="mt-16 text-h3 leading-tight md:text-h3-lg">
              A New Cultural Paradigm
            </h2>
            <p className="mt-8">
              The stories we tell shape the world we build. Our current cultural narrative is
              dominated by visions of dystopia, collapse, and technological peril. While these
              cautionary tales serve a purpose, their overwhelming prevalence has created a
              societal mindset of defeatism and anxiety about the future.
            </p>
            <p className="mt-6">
              It&rsquo;s time to recalibrate our cultural compass. We call for a fundamental
              shift in our storytelling, one that balances critical examination of
              humanity&rsquo;s challenges with inspiring visions of how we might flourish.
            </p>
            <p className="mt-6">This new paradigm must:</p>
            <ul className="mt-6 ml-6 list-disc space-y-3 marker:text-sage">
              <li>Celebrate human ingenuity and our capacity to overcome challenges</li>
              <li>Explore many visions of progress, creating a landscape of possibilities</li>
              <li>
                Highlight the interconnectedness of global issues and the power of collective
                action
              </li>
              <li>
                Showcase the positive potential of emerging technologies while thoughtfully
                addressing their implications
              </li>
              <li>
                Foster a sense of agency and empowerment, encouraging individuals to actively
                participate in shaping the future
              </li>
            </ul>
            <p className="mt-8">
              By looking towards optimistic visions of the future, we can create a
              self-reinforcing cycle of innovation, progress, and hope.
            </p>

            <h2 className="mt-16 text-h3 leading-tight md:text-h3-lg">Taking Action</h2>
            <p className="mt-8">
              <strong>
                To the writers, filmmakers, and creators of tomorrow&rsquo;s stories:
              </strong>{' '}
              We challenge you to craft narratives that ignite the collective imagination and
              drive us towards a better future.
            </p>
            <p className="mt-6">
              <strong>To educators:</strong> Integrate optimistic science fiction into your
              curricula to inspire curiosity, critical thinking, and problem-solving skills in
              your students.
            </p>
            <p className="mt-6">
              <strong>To policymakers:</strong> Recognize the power of narrative in shaping
              public opinion and policy. Support initiatives that promote optimistic visions
              of the future in media and education.
            </p>
            <p className="mt-6">
              <strong>To scientists:</strong> Collaborate with storytellers to ensure your
              groundbreaking work is translated into compelling narratives that capture the
              public imagination.
            </p>
            <p className="mt-6">
              <strong>To funders:</strong> Invest in projects and creators who are committed
              to producing optimistic, scientifically grounded visions of the future.
            </p>
            <p className="mt-6">
              <strong>To tech industry workers:</strong> Use your influence to steer your
              organizations towards more hopeful and ethical visions of technological
              progress.
            </p>
            <p className="mt-6">
              <strong>To media companies and publishers:</strong> Promote works that offer
              inspiring, realistic visions of the future. Balance your content to include more
              optimistic narratives alongside critical examinations of societal issues.
            </p>
            <p className="mt-6">
              <strong>To readers and viewers:</strong> Seek out and support works that offer
              hopeful, realistic visions of the future. Let your engagement be a referendum on
              the kind of world you wish to build.
            </p>
          </article>
        </div>
      </div>
    </Panel>
  );
}

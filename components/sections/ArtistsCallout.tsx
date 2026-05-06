import Link from 'next/link';

export function ArtistsCallout() {
  return (
    <section className="container-wide py-32">
      <div className="grid gap-14 border-t border-rule pt-16 md:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="eyebrow">A note on imagery</p>
          <h2 className="mt-4 text-h2 leading-tight md:text-h2">
            We&rsquo;re seeking artists.
          </h2>
        </div>
        <div className="text-body-lg leading-relaxed text-ink/85">
          <p>
            Some imagery on this site was generated with AI while we build out our roster of
            collaborators. AI tools are useful, but they are tools - they don&rsquo;t replace the
            judgement, taste, or intentionality of a human artist. As we grow we are commissioning
            and replacing this work with original pieces.
          </p>
          <p className="mt-4">
            If you&rsquo;re an illustrator, photographer, designer, or sculptor whose work fits our
            sensibility, we&rsquo;d love to hear from you.
          </p>
          <Link href="/contact" className="mt-8 inline-block btn">
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}

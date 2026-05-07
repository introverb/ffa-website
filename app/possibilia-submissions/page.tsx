import type { Metadata } from 'next';
import Link from 'next/link';
import { Panel } from '@/components/PageFrame';
import { Placeholder } from '@/components/Placeholder';
import { Accordion } from '@/components/Accordion';
import { renderWithArtistLinks } from '@/lib/artists';

export const metadata: Metadata = {
  title: 'Possibilia Submissions',
  description:
    'How to submit fiction, nonfiction, and artwork to Possibilia Magazine. Issue 0 is in development.',
};

export default function PossibiliaSubmissionsPage({
  searchParams,
}: {
  searchParams: { sent?: string };
}) {
  const sent = searchParams?.sent === '1';
  return (
    <>
      {sent && (
        <Panel variant="white" className="border border-sage/40 bg-sage-light/20 md:p-8">
          <p className="eyebrow text-sage">Submission received</p>
          <p className="mt-3 text-h6 leading-snug text-ink">
            Thanks, we&rsquo;ve got your submission and will reach back within four weeks.
          </p>
        </Panel>
      )}

      {/* Submissions box - full image on the left, compact form on the right */}
      <Panel
        variant="white"
        full
        className="grid shadow-[0_-18px_36px_-12px_rgba(0,0,0,0.22)] md:grid-cols-3"
      >
        {/* Image fills its column edge-to-edge, height matches the form column.
            CSS background-image silently falls back to the gradient when the
            file is missing. Artist credit overlays the bottom-right corner. */}
        <div
          role="img"
          aria-label="Possibilia submissions cover art"
          className="relative min-h-[420px] bg-cream bg-cover bg-center md:col-span-1 md:min-h-0"
          style={{ backgroundImage: "url('/images/possibilia-submissions.png')" }}
        >
          <p className="absolute bottom-4 right-4 text-xs italic text-white/90 drop-shadow">
            Possibilia by Dylan Weiler
          </p>
        </div>

        <div className="p-8 md:col-span-2 md:p-12">
          <p className="eyebrow">Possibilia · Issue 0</p>
          <h2 className="mt-3 text-h3 leading-[1.05] md:text-h3-lg">Submit your work</h2>
          <p className="mt-3 max-w-prose text-body leading-relaxed text-muted">
            Pick a track, share your work, and we&rsquo;ll reach back within four weeks.
          </p>
          <div className="mt-8">
            <SubmissionForm />
          </div>
        </div>
      </Panel>

      {/* Submissions Guide - three categories as accordions */}
      <Panel variant="white" className="md:p-20">
        <h2 className="text-h2 leading-[1.05] md:text-h2-lg">Submissions Guide</h2>
        <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-ink/85">
          Possibilia welcomes work from writers, experts, and artists. Expand the track that fits
          your work below for the full submission process and requirements.
        </p>

        <div className="mt-8">
          <Accordion title="Writers: fiction">
            <h3 className="text-h6 text-ink">The role of short stories in Possibilia Magazine</h3>
            <p>
              Throughout history, the relationship between science fiction and technological
              advancement has been a powerful force for progress. Far from mere entertainment,
              speculative narratives have consistently served as inspiration and motivation for
              scientists, engineers, and innovators.
            </p>
            <p>
              We aim to create a landscape of exciting possibilities for humanity, and to publish
              stories that ignite the collective imagination and drive us towards a better future.
            </p>

            <h3 className="mt-6 text-h6 text-ink">Submission process</h3>
            <p>
              <strong>Reach out to us via email with the following:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Your name (or pseudonym)</li>
              <li>A short summary of your story idea</li>
              <li>A sample of your writing (250–500 words)</li>
            </ul>
            <p>
              <em>Note: you do NOT need to submit a finished story.</em>
            </p>
            <p>
              If selected, we&rsquo;ll reach out to establish a timeline, discuss illustration,
              and begin the search for a nonfiction companion piece writer for your story.
            </p>

            <h3 className="mt-6 text-h6 text-ink">Final short story requirements</h3>
            <p>Final drafts of short stories should:</p>
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Total 3,000–7,000 words</li>
              <li>
                Be based around the human experience but incorporate technologies in the
                world-building
              </li>
              <li>Be optimistic and focused on positive directions for the future</li>
              <li>
                Include technologies that one could consider realistic by way of extrapolation
                from today&rsquo;s technologies and potentials
              </li>
              <li>
                Be set in the near-future, though exceptions may be made if the story is
                well-motivated with unique perspectives on long-term trends in the world
              </li>
            </ul>
            <p>
              We <strong>highly</strong> recommend that you read through these helpful resources
              before submitting:
            </p>
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>The Possibilia Writing Contest announcement (coming soon)</li>
              <li>FFA&rsquo;s Manifesto on Optimistic Sci-Fi</li>
              <li>The short guide further down this page</li>
            </ul>
          </Accordion>

          <Accordion title="Writers: nonfiction">
            <h3 className="text-h6 text-ink">The role of nonfiction in Possibilia Magazine</h3>
            <p>
              One of the goals of Possibilia is to inform and educate readers about the reality
              of the technologies represented in the stories we publish. To this aim, we are
              seeking experts in many fields to write companion pieces for stories.
            </p>
            <p>
              These pieces comment on the speculative technology within the stories, as well as
              inform on the current state of relevant fields and innovations. We want readers to
              learn and be inspired through the knowledge offered by those who are actively
              working to further science and tech as well as our understanding of it.
            </p>

            <h3 className="mt-6 text-h6 text-ink">Submission process</h3>
            <p>
              For the most part, we source our companion piece writers based on the stories we
              publish. That said, if you&rsquo;re interested in writing a companion piece for us,
              reach out. We&rsquo;d like to start pairing scientists, researchers, and experts
              with writers to advise on their stories, and we&rsquo;re growing our network to
              include people from many different fields so that we can represent a range of
              subjects and perspectives.
            </p>
            <p>
              If you&rsquo;d like to write companion pieces for us, or advise writers on your
              specific field, please reach out <strong>with the following:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Your name</li>
              <li>Your field</li>
              <li>Your most recent writing/work</li>
              <li>Your preferred involvement level / time commitment</li>
            </ul>
          </Accordion>

          <Accordion title="Illustrators / Artists">
            <h3 className="text-h6 text-ink">The role of art in Possibilia Magazine</h3>
            <p>
              Art has the unique ability to capture the imagination and convey complex ideas at a
              glance, and visual storytelling is just as crucial as written narratives. The
              artwork accompanying our stories not only enhances the reader&rsquo;s experience
              but also helps to visualize the optimistic futures we strive to depict.
            </p>
            <p>
              We are looking for talented illustrators and artists who can bring our stories to
              life with their unique styles and perspectives. Your work will help create an
              immersive experience for our readers, transporting them into the worlds our writers
              have imagined.
            </p>

            <h3 className="mt-6 text-h6 text-ink">Illustration requirements</h3>
            <p>Final drafts of illustrations should:</p>
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Be high-resolution (300 DPI minimum)</li>
              <li>Align with the optimistic and forward-looking themes of the magazine</li>
              <li>
                Complement and enhance the stories they accompany, providing a visual
                representation of the narrative and technologies depicted
              </li>
              <li>Be original works created specifically for Possibilia Magazine</li>
            </ul>

            <h3 className="mt-6 text-h6 text-ink">Submission process</h3>
            <p>
              If you&rsquo;re interested in submitting your artwork or collaborating with our
              writers, reach out to us <strong>with the following:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Your name (or pseudonym)</li>
              <li>A short summary of your artistic vision and style</li>
              <li>A portfolio of your work (5–10 pieces)</li>
            </ul>
            <p>
              <em>
                Note: you do NOT need to submit finished illustrations for specific stories at
                this stage.
              </em>
            </p>
          </Accordion>
        </div>

        <h2 className="mt-20 text-h2 leading-[1.05] md:text-h2-lg">
          Tips for creating optimistic, realistic sci-fi
        </h2>
        <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-ink/85">
          At Possibilia, we&rsquo;re on a mission to shape our future through optimistic,
          realistic science fiction. Here are a few things we look for in story submissions.
        </p>

        <div className="mt-8">
          <Accordion title="Embrace optimistic realism">
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Balance hope with plausibility</li>
              <li>Avoid dystopian pessimism and unrealistic utopias</li>
              <li>Show progress and challenges coexisting</li>
            </ul>
          </Accordion>

          <Accordion title="Ground your science">
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Base technological concepts on current trends and research</li>
              <li>Extrapolate thoughtfully from existing innovations</li>
              <li>Consult experts or do thorough research to ensure credibility</li>
            </ul>
          </Accordion>

          <Accordion title="Explore social technology">
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Examine how new technologies shape society and human relationships</li>
              <li>
                Consider the societal context that the story occurs within; how have things
                changed?
              </li>
              <li>Depict new social structures and adaptations</li>
            </ul>
          </Accordion>

          <Accordion title="Present innovative solutions">
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Showcase human ingenuity in addressing real-world problems</li>
              <li>
                Think outside the box: consider interdisciplinary approaches, explore niche or
                neglected technology, find unexplored areas of potential
              </li>
              <li>Illustrate both technological and social innovations</li>
            </ul>
          </Accordion>

          <Accordion title="Grapple with big questions">
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Address moral implications of new technologies and social structures</li>
              <li>
                Present nuanced dilemmas (whether ethical or concrete technological) without
                easy answers
              </li>
              <li>Show characters wrestling with complex decisions</li>
            </ul>
          </Accordion>

          <Accordion title="Focus on human stories">
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Ground big ideas in relatable personal experiences</li>
              <li>Develop complex, evolving characters</li>
              <li>Use individual narratives to illustrate broader societal shifts</li>
            </ul>
          </Accordion>

          <Accordion title="Inspire action">
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Do research to find real areas of scientific or technological potential</li>
              <li>Craft narratives that motivate readers to envision a better future</li>
              <li>Leave readers with a sense of agency and possibility</li>
            </ul>
          </Accordion>

          <Accordion title="Bridge imagination and reality">
            <ul className="ml-6 list-disc space-y-2 marker:text-sage">
              <li>Create clear connections between current issues and future solutions</li>
              <li>Help readers see pathways from the present to your envisioned future</li>
              <li>Make your world feel like an achievable evolution of our own</li>
            </ul>
          </Accordion>
        </div>

        {/* Closing bookend - display font, larger size */}
        <p
          className="mt-20 max-w-3xl text-h4 leading-snug text-ink"
          style={{
            fontFamily:
              'var(--font-display), "Eurostile Next Pro", "Eurostile", Helvetica, Arial, sans-serif',
            fontWeight: 600,
          }}
        >
          Remember, a Possibilia story should leave readers feeling informed, inspired, and
          empowered to shape the future. We&rsquo;re not just telling stories; we&rsquo;re
          crafting blueprints for tomorrow. Happy imagining.
        </p>
      </Panel>

      <Panel variant="white" className="md:p-16">
        <p className="eyebrow">Recommended reading</p>
        <Link href="/resources/manifesto" className="group mt-6 block">
          <h2 className="text-h3 leading-tight md:text-h3-lg group-hover:text-sage">
            Manifesto: forging our future through optimistic science fiction
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.08em] text-muted">
            By {renderWithArtistLinks('Olli Payne')}
          </p>
          <p className="mt-4 max-w-prose text-body leading-relaxed text-muted">
            Why we believe the stories we tell about tomorrow shape the world we actually
            build, and how an optimistic, realistic aesthetic can reset the canon.
          </p>
          <p className="mt-6 text-sm underline decoration-from-font underline-offset-4 text-ink group-hover:text-sage">
            Read the manifesto →
          </p>
        </Link>
      </Panel>
    </>
  );
}

// ---------- Form ----------

function SubmissionForm() {
  return (
    <form
      action="/api/possibilia-submission"
      method="POST"
      encType="multipart/form-data"
      className="space-y-5"
    >
      <FieldGroup label="Submission type" required>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {['Fiction', 'Nonfiction', 'Art', 'Other'].map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center justify-center rounded-full border border-rule bg-paper px-4 py-2 text-sm uppercase tracking-wider transition has-[:checked]:border-sage has-[:checked]:bg-sage has-[:checked]:text-white"
            >
              <input type="radio" name="type" value={opt} required className="sr-only" />
              {opt}
            </label>
          ))}
        </div>
      </FieldGroup>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name (or pseudonym)" required />
        <Field id="email" type="email" label="Email" required />
      </div>

      <Field
        id="description"
        label="Description"
        required
        textarea
        rows={3}
        help="Story summary, artistic vision, pitch: what are you proposing?"
      />

      <FieldGroup
        label="Links"
        help="Up to 3: Google Docs, portfolio, examples, or social"
      >
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <input
              key={n}
              type="url"
              name={`link${n}`}
              placeholder={`https://… (link ${n})`}
              className="w-full rounded border border-rule bg-paper px-3 py-2 text-body"
            />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup
        label="Submissions"
        help="Up to 5 files: manuscripts, portfolio pieces, or supporting documents (PDF, DOCX, JPG, PNG). For Google Docs, paste the link above."
      >
        <input
          type="file"
          name="files"
          multiple
          accept=".pdf,.doc,.docx,.txt,.rtf,image/*"
          className="block w-full text-body file:mr-4 file:rounded-full file:border-0 file:bg-sage file:px-4 file:py-2 file:text-sm file:font-medium file:uppercase file:tracking-wider file:text-white file:hover:bg-dark"
        />
      </FieldGroup>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button type="submit" className="btn-solid">
          Send submission
        </button>
        <p className="text-eyebrow text-muted">
          We&rsquo;ll respond within four weeks.
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = 'text',
  required = false,
  textarea = false,
  rows = 3,
  help,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  help?: string;
}) {
  return (
    <FieldGroup label={label} required={required} help={help}>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          required={required}
          rows={rows}
          className="w-full resize-none rounded border border-rule bg-paper px-3 py-2 text-body"
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          className="w-full rounded border border-rule bg-paper px-3 py-2 text-body"
        />
      )}
    </FieldGroup>
  );
}

function FieldGroup({
  label,
  required = false,
  help,
  children,
}: {
  label: string;
  required?: boolean;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-eyebrow text-ink/80">
        {label}
        {required && <span className="ml-1 text-sage">*</span>}
      </label>
      <div className="mt-2">{children}</div>
      {help && <p className="mt-1 text-eyebrow text-muted normal-case tracking-normal">{help}</p>}
    </div>
  );
}

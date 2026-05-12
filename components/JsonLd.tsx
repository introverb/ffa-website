// Renders a Schema.org JSON-LD payload as an inline <script> tag.
// Drop one of these into any page or layout to give search engines
// machine-readable context about what the page is — Article, Event,
// Organization, Person, etc. Google, Bing, and others parse the
// payload to generate richer search results (bylines, event cards,
// Knowledge Graph entries).
//
// Server component — runs at SSR and emits static HTML. The `data`
// argument should be a plain object matching a Schema.org type;
// it's JSON-stringified and embedded verbatim.
//
// Example:
//   <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', ... }} />

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify produces a safe string for an HTML script body
      // (no closing </script> sequences possible in valid JSON).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Accordion built on the native <details> element - keyboard- and screen-reader-
// accessible by default, no JS required. The +/− indicator rotates when open.

export function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-t-[3px] border-rule first:border-t-0 last:border-b-[3px] last:border-rule">
      <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 list-none [&::-webkit-details-marker]:hidden">
        <span className="text-h5 md:text-h4 leading-tight">{title}</span>
        <span
          aria-hidden
          className="shrink-0 text-h4 leading-none text-sage transition-transform duration-200 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="max-w-prose space-y-4 pb-8 text-body-lg leading-relaxed text-ink/90">
        {children}
      </div>
    </details>
  );
}

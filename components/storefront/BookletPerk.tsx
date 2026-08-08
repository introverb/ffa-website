import Image from 'next/image';

// Event-night-only perk callout — a miniature, realistic recreation of
// the actual printed OURS program (same cover photo, layout, and type
// as the real piece, not a generic gift-icon) so a buyer can see
// exactly what they're getting. Stacked "leaf" layers + a striped
// spine edge suggest the ~1/4in page block; a -4deg tilt and drop
// shadow keep it reading as a small physical object rather than a
// flat card. Colors inside the cover recreation are the print piece's
// own palette (not the site's tokens) since it's reproducing that
// specific object — matches components/OursCheckInForm.tsx's approach
// of a few one-off pieces not needing to share the site's design
// tokens verbatim. See public/membership.html for the equivalent,
// independently built for that page's own (non-Tailwind) stylesheet.
export function BookletPerk() {
  return (
    <div className="mt-8 flex flex-col items-center gap-6 rounded-2xl bg-cream p-6 text-center text-ink sm:flex-row sm:gap-6 sm:p-7 sm:text-left">
      <div className="relative h-[229px] w-[162px] shrink-0 [filter:drop-shadow(0_10px_18px_rgba(0,0,0,.30))]">
        <div className="absolute inset-0 rounded-[1px] bg-[#d4cdba] [transform:rotate(-4deg)_translate(7px,9px)]" />
        <div className="absolute inset-0 rounded-[1px] bg-[#ded8c9] [transform:rotate(-4deg)_translate(4px,5px)]" />
        <div className="absolute bottom-[3px] left-[1px] top-[3px] w-[3px] rounded-l-[1px] [background:repeating-linear-gradient(180deg,#efece6_0px,#efece6_1px,#d8d3c5_1px,#d8d3c5_2px)] [transform:rotate(-4deg)_translate(-1px,0)]" />
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[1px] border border-black/10 bg-[#f0eeeb] p-[9px_10px_8px] [transform:rotate(-4deg)]">
          <div className="font-mono text-[4.6px] uppercase leading-[1.3] tracking-[0.09em] text-[#8a867c]">
            Foundation for Future Aesthetics Presents
          </div>
          <div className="mt-[3px] h-px bg-flare" />
          <div className="relative mt-[7px] h-[46px] overflow-hidden rounded-[1px] bg-[#cfd6c6]">
            <Image
              src="/images/ours-booklet-cover.jpg"
              alt="OURS printed program cover"
              fill
              priority
              sizes="150px"
              className="object-cover object-[center_38%]"
            />
          </div>
          <div className="mt-[7px] font-heading text-[29px] font-extrabold leading-[0.86] tracking-[-0.01em] text-[#1c1a17]">
            OURS
          </div>
          <div className="mt-[2px] h-[2px] w-[22px] bg-flare" />
          <div className="mt-[5px] max-w-[92px] text-[4.7px] leading-[1.35] text-[#3a372f]">
            A one-night exhibition &amp; salon on acting to bring about our positive visions of the future.
          </div>
          <div className="flex-1" />
          <div className="mb-[3px] h-px bg-[#1c1a17]" />
          <div className="font-mono text-[4.4px] tracking-[0.01em] text-[#3a372f]">
            Sun, Aug 9 &middot; Space LES &middot; NYC
          </div>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-flare">Tonight only</p>
        <h2 className="mt-1.5 text-h5 leading-tight text-ink md:text-h4">
          Collect a piece, take home a commemorative booklet.
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/70">
          Every piece purchased tonight comes with a complimentary printed OURS booklet, on the
          house.
        </p>
      </div>
    </div>
  );
}

// Lightweight placeholder for image slots — renders a tasteful gradient when
// the file at `src` is missing. Drop real images into /public/images/ and the
// real image will load automatically.

import Image from 'next/image';

type Props = {
  src?: string;
  alt: string;
  className?: string;
  ratio?: 'square' | '4/3' | '16/9' | '3/4';
  priority?: boolean;
};

const RATIO: Record<NonNullable<Props['ratio']>, string> = {
  square: 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-[16/9]',
  '3/4': 'aspect-[3/4]',
};

export function Placeholder({ src, alt, className = '', ratio = '4/3', priority }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-gradient-to-br from-cream via-rule/70 to-accent/30 ${RATIO[ratio]} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center font-sans text-xs uppercase tracking-[0.18em] text-muted">
          {alt}
        </div>
      )}
    </div>
  );
}

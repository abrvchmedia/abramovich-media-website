import Link from "next/link";

interface Props {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroBlock({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaLink,
}: Props) {
  return (
    <section
      className="relative py-32 px-6 flex items-center justify-center text-center bg-cover bg-center"
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-navy/80" />
      )}
      <div className="relative max-w-3xl mx-auto">
        {title && (
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {ctaText && ctaLink && (
          <Link
            href={ctaLink}
            className="inline-block bg-accent text-navy font-semibold px-8 py-3 rounded-lg text-sm hover:bg-accent/90 transition-colors shadow-glow-cta"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}

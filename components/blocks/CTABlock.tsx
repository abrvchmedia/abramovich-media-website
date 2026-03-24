import Link from "next/link";

interface Props {
  heading?: string;
  body?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function CTABlock({
  heading,
  body,
  buttonText,
  buttonLink,
}: Props) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {heading}
          </h2>
        )}
        {body && (
          <p className="text-text-muted text-lg mb-8 leading-relaxed">
            {body}
          </p>
        )}
        {buttonText && buttonLink && (
          <Link
            href={buttonLink}
            className="inline-block bg-cta text-white font-semibold px-8 py-3 rounded-lg text-sm hover:bg-cta/90 transition-colors shadow-glow-cta"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}

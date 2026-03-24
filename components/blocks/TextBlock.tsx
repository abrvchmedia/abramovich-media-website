interface Props {
  heading?: string;
  text?: string;
}

export default function TextBlock({ heading, text }: Props) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {heading}
          </h2>
        )}
        {text && (
          <div className="text-text-muted text-lg leading-relaxed whitespace-pre-wrap">
            {text}
          </div>
        )}
      </div>
    </section>
  );
}

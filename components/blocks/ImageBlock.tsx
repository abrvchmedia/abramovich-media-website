interface Props {
  src?: string;
  alt?: string;
}

export default function ImageBlock({ src, alt }: Props) {
  if (!src) return null;

  return (
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <img
          src={src}
          alt={alt || "Abramovich Media content image"}
          className="w-full rounded-xl object-cover shadow-card"
        />
      </div>
    </section>
  );
}

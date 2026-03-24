interface GridItem {
  title: string;
  description: string;
  image?: string;
}

interface Props {
  items?: GridItem[];
}

export default function GridBlock({ items }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-navy-light border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

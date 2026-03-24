"use client";

interface GridItem {
  title: string;
  description: string;
  image: string;
}

interface GridBlockContent {
  items?: GridItem[];
}

interface Props {
  content: GridBlockContent;
  onChange: (content: GridBlockContent) => void;
}

export default function GridBlockEditor({ content, onChange }: Props) {
  const items = content.items || [];

  function updateItem(index: number, field: keyof GridItem, value: string) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...content, items: updated });
  }

  function addItem() {
    onChange({
      ...content,
      items: [...items, { title: "", description: "", image: "" }],
    });
  }

  function removeItem(index: number) {
    onChange({ ...content, items: items.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-white/10 rounded-lg p-3 space-y-2"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-text-muted">
              Item {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            value={item.title}
            onChange={(e) => updateItem(index, "title", e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            placeholder="Item title"
          />
          <textarea
            value={item.description}
            onChange={(e) => updateItem(index, "description", e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-none"
            placeholder="Item description"
          />
          <input
            type="text"
            value={item.image}
            onChange={(e) => updateItem(index, "image", e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            placeholder="Image URL (optional)"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="w-full border border-dashed border-white/10 rounded-lg py-2 text-xs text-text-muted hover:text-white hover:border-white/20 transition-colors"
      >
        + Add Grid Item
      </button>
    </div>
  );
}

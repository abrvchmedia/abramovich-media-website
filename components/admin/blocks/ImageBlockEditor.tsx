"use client";

interface ImageBlockContent {
  src?: string;
  alt?: string;
}

interface Props {
  content: ImageBlockContent;
  onChange: (content: ImageBlockContent) => void;
}

export default function ImageBlockEditor({ content, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Image URL
        </label>
        <input
          type="text"
          value={content.src || ""}
          onChange={(e) => onChange({ ...content, src: e.target.value })}
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Alt Text
        </label>
        <input
          type="text"
          value={content.alt || ""}
          onChange={(e) => onChange({ ...content, alt: e.target.value })}
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
          placeholder="Image description"
        />
      </div>
      {content.src && (
        <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
          <img
            src={content.src}
            alt={content.alt || "Preview"}
            className="max-h-48 w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

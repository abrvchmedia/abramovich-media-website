"use client";

interface TextBlockContent {
  heading?: string;
  text?: string;
}

interface Props {
  content: TextBlockContent;
  onChange: (content: TextBlockContent) => void;
}

export default function TextBlockEditor({ content, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Heading (optional)
        </label>
        <input
          type="text"
          value={content.heading || ""}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
          placeholder="Section heading"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Text
        </label>
        <textarea
          value={content.text || ""}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          rows={5}
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-y"
          placeholder="Paragraph text..."
        />
      </div>
    </div>
  );
}

"use client";

interface CTABlockContent {
  heading?: string;
  body?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface Props {
  content: CTABlockContent;
  onChange: (content: CTABlockContent) => void;
}

export default function CTABlockEditor({ content, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Heading
        </label>
        <input
          type="text"
          value={content.heading || ""}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
          placeholder="CTA heading"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Body
        </label>
        <textarea
          value={content.body || ""}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
          rows={3}
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-y"
          placeholder="CTA description"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={content.buttonText || ""}
            onChange={(e) =>
              onChange({ ...content, buttonText: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            placeholder="Learn More"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Button Link
          </label>
          <input
            type="text"
            value={content.buttonLink || ""}
            onChange={(e) =>
              onChange({ ...content, buttonLink: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            placeholder="/pricing"
          />
        </div>
      </div>
    </div>
  );
}

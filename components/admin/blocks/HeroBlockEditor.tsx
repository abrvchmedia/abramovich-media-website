"use client";

interface HeroBlockContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface Props {
  content: HeroBlockContent;
  onChange: (content: HeroBlockContent) => void;
}

export default function HeroBlockEditor({ content, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Title
        </label>
        <input
          type="text"
          value={content.title || ""}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
          placeholder="Hero title"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Subtitle
        </label>
        <input
          type="text"
          value={content.subtitle || ""}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
          placeholder="Hero subtitle"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Background Image URL
        </label>
        <input
          type="text"
          value={content.backgroundImage || ""}
          onChange={(e) =>
            onChange({ ...content, backgroundImage: e.target.value })
          }
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
          placeholder="https://..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            CTA Text
          </label>
          <input
            type="text"
            value={content.ctaText || ""}
            onChange={(e) => onChange({ ...content, ctaText: e.target.value })}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            placeholder="Get Started"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            CTA Link
          </label>
          <input
            type="text"
            value={content.ctaLink || ""}
            onChange={(e) => onChange({ ...content, ctaLink: e.target.value })}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            placeholder="/contact"
          />
        </div>
      </div>
    </div>
  );
}

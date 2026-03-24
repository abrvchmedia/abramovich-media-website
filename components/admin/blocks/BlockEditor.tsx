"use client";

import TextBlockEditor from "./TextBlockEditor";
import ImageBlockEditor from "./ImageBlockEditor";
import HeroBlockEditor from "./HeroBlockEditor";
import CTABlockEditor from "./CTABlockEditor";
import GridBlockEditor from "./GridBlockEditor";

interface Block {
  id: string;
  type: string;
  content: Record<string, unknown>;
  order: number;
}

interface Props {
  block: Block;
  index: number;
  total: number;
  onUpdate: (content: Record<string, unknown>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  text: "Text",
  image: "Image",
  hero: "Hero",
  cta: "CTA",
  grid: "Grid",
};

const TYPE_COLORS: Record<string, string> = {
  text: "bg-blue-500/10 text-blue-400",
  image: "bg-purple-500/10 text-purple-400",
  hero: "bg-amber-500/10 text-amber-400",
  cta: "bg-cta/10 text-cta",
  grid: "bg-pink-500/10 text-pink-400",
};

export default function BlockEditor({
  block,
  index,
  total,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDelete,
}: Props) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const editors: Record<string, React.ComponentType<any>> = {
    text: TextBlockEditor,
    image: ImageBlockEditor,
    hero: HeroBlockEditor,
    cta: CTABlockEditor,
    grid: GridBlockEditor,
  };

  const EditorComponent = editors[block.type];

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5">
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
              TYPE_COLORS[block.type] || "bg-white/10 text-white"
            }`}
          >
            {TYPE_LABELS[block.type] || block.type}
          </span>
          <span className="text-xs text-text-muted">Block {index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 text-text-muted hover:text-white disabled:opacity-20 transition-colors"
            title="Move up"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1.5 text-text-muted hover:text-white disabled:opacity-20 transition-colors"
            title="Move down"
          >
            ▼
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-text-muted hover:text-red-400 transition-colors ml-2"
            title="Delete block"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="p-4">
        {EditorComponent ? (
          <EditorComponent
            content={block.content || {}}
            onChange={onUpdate}
          />
        ) : (
          <p className="text-sm text-text-muted">
            Unknown block type: {block.type}
          </p>
        )}
      </div>
    </div>
  );
}

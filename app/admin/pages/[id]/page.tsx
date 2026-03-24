"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { admin } from "@/lib/api";
import { slugify } from "@/backend/utils/slugify";
import BlockEditor from "@/components/admin/blocks/BlockEditor";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Block {
  id: string;
  type: string;
  content: Record<string, unknown>;
  order: number;
}

interface PageData {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
  blocks: Block[];
  updatedAt: string;
}

const BLOCK_TYPES = [
  { type: "text", label: "Text", desc: "Heading + paragraph" },
  { type: "image", label: "Image", desc: "Image with alt text" },
  { type: "hero", label: "Hero", desc: "Hero banner with CTA" },
  { type: "cta", label: "CTA", desc: "Call to action section" },
  { type: "grid", label: "Grid", desc: "Grid of items" },
];

export default function PageEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showDeletePage, setShowDeletePage] = useState(false);
  const [autoSlug, setAutoSlug] = useState(false);

  const loadPage = useCallback(async () => {
    try {
      const data = (await admin.getPage(id)) as PageData;
      setPage(data);
    } catch {
      setError("Failed to load page");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  async function handleSave() {
    if (!page) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = (await admin.updatePage(id, {
        title: page.title,
        slug: page.slug,
        status: page.status,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        blocks: page.blocks,
      })) as PageData;
      setPage(updated);
      setSuccess("Page saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePage() {
    await admin.deletePage(id);
    router.push("/admin/pages");
  }

  function handleTitleChange(value: string) {
    if (!page) return;
    setPage({ ...page, title: value });
    if (autoSlug) setPage((p) => (p ? { ...p, slug: slugify(value) } : p));
  }

  function addBlock(type: string) {
    if (!page) return;
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type,
      content: {},
      order: page.blocks.length,
    };
    setPage({ ...page, blocks: [...page.blocks, newBlock] });
    setShowAddBlock(false);
  }

  function updateBlockContent(blockId: string, content: Record<string, unknown>) {
    if (!page) return;
    setPage({
      ...page,
      blocks: page.blocks.map((b) =>
        b.id === blockId ? { ...b, content } : b
      ),
    });
  }

  function removeBlock(blockId: string) {
    if (!page) return;
    setPage({
      ...page,
      blocks: page.blocks
        .filter((b) => b.id !== blockId)
        .map((b, i) => ({ ...b, order: i })),
    });
  }

  function moveBlock(blockId: string, direction: "up" | "down") {
    if (!page) return;
    const blocks = [...page.blocks].sort((a, b) => a.order - b.order);
    const idx = blocks.findIndex((b) => b.id === blockId);
    if (direction === "up" && idx > 0) {
      [blocks[idx], blocks[idx - 1]] = [blocks[idx - 1], blocks[idx]];
    } else if (direction === "down" && idx < blocks.length - 1) {
      [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]];
    }
    setPage({
      ...page,
      blocks: blocks.map((b, i) => ({ ...b, order: i })),
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Loading page editor...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Page not found</p>
        <Link href="/admin/pages" className="text-accent text-sm hover:underline mt-2 inline-block">
          Back to pages
        </Link>
      </div>
    );
  }

  const sortedBlocks = [...page.blocks].sort((a, b) => a.order - b.order);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/admin/pages"
              className="text-text-muted hover:text-white text-sm transition-colors"
            >
              ← Pages
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white">Edit Page</h1>
          {page.updatedAt && (
            <p className="text-xs text-text-muted mt-1">
              Last updated: {new Date(page.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {page.status === "published" && (
            <Link
              href={`/${page.slug}`}
              target="_blank"
              className="text-sm text-text-muted hover:text-white border border-white/10 px-4 py-2 rounded-lg transition-colors"
            >
              Preview ↗
            </Link>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-accent text-navy font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Page"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-cta/10 border border-cta/20 text-cta text-sm px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* Page Settings */}
      <div className="bg-navy-light border border-white/5 rounded-xl p-6 mb-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">
              Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-sm">/</span>
              <input
                type="text"
                value={page.slug}
                onChange={(e) => {
                  setPage({ ...page, slug: e.target.value });
                  setAutoSlug(false);
                }}
                className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            Status
          </label>
          <div className="flex gap-2">
            {(["draft", "published"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPage({ ...page, status: s })}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  page.status === s
                    ? s === "published"
                      ? "bg-cta/20 text-cta border border-cta/30"
                      : "bg-white/10 text-white border border-white/20"
                    : "bg-white/5 text-text-muted border border-white/5 hover:bg-white/10"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <details className="group">
          <summary className="text-sm font-medium text-text-muted cursor-pointer hover:text-white transition-colors">
            SEO Settings
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                SEO Title
              </label>
              <input
                type="text"
                value={page.seoTitle}
                onChange={(e) =>
                  setPage({ ...page, seoTitle: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                placeholder="Defaults to page title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                SEO Description
              </label>
              <textarea
                value={page.seoDescription}
                onChange={(e) =>
                  setPage({ ...page, seoDescription: e.target.value })
                }
                rows={3}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-none"
              />
            </div>
          </div>
        </details>
      </div>

      {/* Blocks */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Content Blocks ({sortedBlocks.length})
        </h2>
      </div>

      <div className="space-y-4 mb-4">
        {sortedBlocks.length === 0 && (
          <div className="bg-navy-light border border-dashed border-white/10 rounded-xl p-12 text-center">
            <p className="text-text-muted text-sm">
              No blocks yet. Add your first block below.
            </p>
          </div>
        )}
        {sortedBlocks.map((block, index) => (
          <BlockEditor
            key={block.id}
            block={block}
            index={index}
            total={sortedBlocks.length}
            onUpdate={(content) => updateBlockContent(block.id, content)}
            onMoveUp={() => moveBlock(block.id, "up")}
            onMoveDown={() => moveBlock(block.id, "down")}
            onDelete={() => removeBlock(block.id)}
          />
        ))}
      </div>

      {/* Add Block */}
      {showAddBlock ? (
        <div className="bg-navy-light border border-white/10 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-white mb-3">
            Choose block type
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {BLOCK_TYPES.map((bt) => (
              <button
                key={bt.type}
                onClick={() => addBlock(bt.type)}
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-left hover:bg-white/10 hover:border-white/20 transition-colors"
              >
                <p className="text-sm font-medium text-white">{bt.label}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{bt.desc}</p>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddBlock(false)}
            className="mt-3 text-xs text-text-muted hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAddBlock(true)}
          className="w-full border border-dashed border-white/10 rounded-xl py-3 text-sm text-text-muted hover:text-white hover:border-white/20 transition-colors mb-6"
        >
          + Add Block
        </button>
      )}

      {/* Danger Zone */}
      <div className="border border-red-500/10 rounded-xl p-5 mt-8">
        <h3 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h3>
        <button
          onClick={() => setShowDeletePage(true)}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Delete this page permanently
        </button>
      </div>

      <ConfirmDialog
        open={showDeletePage}
        title="Delete Page"
        message={`Are you sure you want to delete "${page.title}"? This will remove all blocks and cannot be undone.`}
        onConfirm={handleDeletePage}
        onCancel={() => setShowDeletePage(false)}
      />
    </div>
  );
}

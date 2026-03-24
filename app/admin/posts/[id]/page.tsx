"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { admin } from "@/lib/api";
import { slugify } from "@/backend/utils/slugify";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface PostData {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string;
  tags: string[];
  status: "draft" | "published";
  updatedAt: string;
}

export default function PostEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [autoSlug, setAutoSlug] = useState(false);

  const loadPost = useCallback(async () => {
    try {
      const data = (await admin.getPost(id)) as PostData;
      setPost(data);
    } catch {
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  async function handleSave() {
    if (!post) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = (await admin.updatePost(id, {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        content: post.content,
        tags: post.tags,
        status: post.status,
      })) as PostData;
      setPost(updated);
      setSuccess("Post saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await admin.deletePost(id);
    router.push("/admin/posts");
  }

  function handleTitleChange(value: string) {
    if (!post) return;
    setPost({ ...post, title: value });
    if (autoSlug) setPost((p) => (p ? { ...p, slug: slugify(value) } : p));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Loading post editor...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Post not found</p>
        <Link href="/admin/posts" className="text-accent text-sm hover:underline mt-2 inline-block">
          Back to posts
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/admin/posts"
              className="text-text-muted hover:text-white text-sm transition-colors"
            >
              ← Posts
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white">Edit Post</h1>
          {post.updatedAt && (
            <p className="text-xs text-text-muted mt-1">
              Last updated: {new Date(post.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {post.status === "published" && (
            <Link
              href={`/blog/${post.slug}`}
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
            {saving ? "Saving..." : "Save Post"}
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

      <div className="bg-navy-light border border-white/5 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">
              Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-sm">/blog/</span>
              <input
                type="text"
                value={post.slug}
                onChange={(e) => {
                  setPost({ ...post, slug: e.target.value });
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
                onClick={() => setPost({ ...post, status: s })}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  post.status === s
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

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            Excerpt
          </label>
          <textarea
            value={post.excerpt}
            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            rows={2}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-none"
            placeholder="Brief summary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            Cover Image URL
          </label>
          <input
            type="text"
            value={post.coverImage}
            onChange={(e) => setPost({ ...post, coverImage: e.target.value })}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            placeholder="https://..."
          />
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt="Cover preview"
              className="mt-2 rounded-lg max-h-40 object-cover"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={(post.tags || []).join(", ")}
            onChange={(e) =>
              setPost({
                ...post,
                tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
              })
            }
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            placeholder="video production, SEO, brand authority"
          />
          <p className="text-xs text-text-muted mt-1">
            Used for SEO keywords and article metadata
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            Content
          </label>
          <textarea
            value={typeof post.content === "string" ? post.content : JSON.stringify(post.content, null, 2)}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            rows={16}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-y"
            placeholder="Write your post content here..."
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-500/10 rounded-xl p-5 mt-8">
        <h3 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h3>
        <button
          onClick={() => setShowDelete(true)}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Delete this post permanently
        </button>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${post.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}

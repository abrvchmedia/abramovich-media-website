"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { admin } from "@/lib/api";
import { slugify } from "@/backend/utils/slugify";

export default function NewPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (autoSlug) setSlug(slugify(value));
  }

  function handleSlugChange(value: string) {
    setSlug(value);
    setAutoSlug(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const post = (await admin.createPost({
        title,
        slug,
        excerpt,
        coverImage,
        content,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        status,
      })) as { _id: string };
      router.push(`/admin/posts/${post._id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">New Post</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-navy-light border border-white/5 rounded-xl p-6 max-w-2xl space-y-5"
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            placeholder="Post title"
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
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
              placeholder="post-slug"
            />
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
                onClick={() => setStatus(s)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  status === s
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
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-none"
            placeholder="Brief summary of the post"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            Cover Image URL
          </label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            placeholder="https://..."
          />
          {coverImage && (
            <img
              src={coverImage}
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
            value={tags}
            onChange={(e) => setTags(e.target.value)}
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-y"
            placeholder="Write your post content here..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-accent text-navy font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className="text-text-muted hover:text-white px-4 py-2.5 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

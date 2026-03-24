"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { admin } from "@/lib/api";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface PageItem {
  _id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
  blocks: unknown[];
}

export default function AdminPagesListPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PageItem | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    try {
      const data = (await admin.getPages()) as PageItem[];
      setPages(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await admin.deletePage(deleteTarget._id);
    setDeleteTarget(null);
    loadPages();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Loading pages...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Pages</h1>
          <p className="text-sm text-text-muted mt-1">
            {pages.length} page{pages.length !== 1 && "s"}
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="bg-accent text-navy font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-accent/90 transition-colors"
        >
          + New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="bg-navy-light border border-white/5 rounded-xl p-12 text-center">
          <p className="text-text-muted">No pages yet.</p>
          <Link
            href="/admin/pages/new"
            className="inline-block mt-4 text-accent text-sm hover:underline"
          >
            Create your first page
          </Link>
        </div>
      ) : (
        <div className="bg-navy-light border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                  Title
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                  Slug
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                  Blocks
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                  Updated
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr
                  key={page._id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3">
                    <button
                      onClick={() => router.push(`/admin/pages/${page._id}`)}
                      className="text-sm font-medium text-white hover:text-accent transition-colors text-left"
                    >
                      {page.title}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-sm text-text-muted font-mono">
                    /{page.slug}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        page.status === "published"
                          ? "bg-cta/10 text-cta"
                          : "bg-white/10 text-text-muted"
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-text-muted">
                    {page.blocks?.length || 0}
                  </td>
                  <td className="px-5 py-3 text-sm text-text-muted">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setDeleteTarget(page)}
                      className="text-xs text-text-muted hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Page"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

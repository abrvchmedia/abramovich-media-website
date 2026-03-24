"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { admin } from "@/lib/api";

interface PageItem {
  _id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
}

interface PostItem {
  _id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([admin.getPages(), admin.getPosts()])
      .then(([p, b]) => {
        setPages(p as PageItem[]);
        setPosts(b as PostItem[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const publishedPages = pages.filter((p) => p.status === "published").length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage your site content
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Pages", value: pages.length, color: "text-accent" },
          { label: "Published Pages", value: publishedPages, color: "text-cta" },
          { label: "Total Posts", value: posts.length, color: "text-secondary" },
          { label: "Published Posts", value: publishedPosts, color: "text-cta" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-navy-light border border-white/5 rounded-xl p-5"
          >
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Link
          href="/admin/pages/new"
          className="bg-accent text-navy font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-accent/90 transition-colors"
        >
          + New Page
        </Link>
        <Link
          href="/admin/posts/new"
          className="bg-white/10 text-white font-medium px-4 py-2.5 rounded-lg text-sm hover:bg-white/15 transition-colors"
        >
          + New Post
        </Link>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-light border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Pages</h2>
            <Link
              href="/admin/pages"
              className="text-xs text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          {pages.length === 0 ? (
            <p className="text-sm text-text-muted py-4">No pages yet.</p>
          ) : (
            <div className="space-y-2">
              {pages.slice(0, 5).map((page) => (
                <Link
                  key={page._id}
                  href={`/admin/pages/${page._id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className="text-sm text-white group-hover:text-accent transition-colors">
                    {page.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      page.status === "published"
                        ? "bg-cta/10 text-cta"
                        : "bg-white/10 text-text-muted"
                    }`}
                  >
                    {page.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-navy-light border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Posts</h2>
            <Link
              href="/admin/posts"
              className="text-xs text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          {posts.length === 0 ? (
            <p className="text-sm text-text-muted py-4">No posts yet.</p>
          ) : (
            <div className="space-y-2">
              {posts.slice(0, 5).map((post) => (
                <Link
                  key={post._id}
                  href={`/admin/posts/${post._id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className="text-sm text-white group-hover:text-accent transition-colors">
                    {post.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      post.status === "published"
                        ? "bg-cta/10 text-cta"
                        : "bg-white/10 text-text-muted"
                    }`}
                  >
                    {post.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

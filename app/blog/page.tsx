import Link from "next/link";
import { getAllPosts } from "@/backend/controllers/postController";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on authority infrastructure, cinematic media production, and digital strategy from Abramovich Media.",
  keywords: [
    "media production blog",
    "authority infrastructure insights",
    "cinematic video production tips",
    "digital strategy blog",
    "brand authority",
    "Abramovich Media blog",
  ],
  alternates: {
    canonical: "https://www.abramovichmedia.com/blog",
  },
  openGraph: {
    title: "Blog | Abramovich Media",
    description:
      "Insights on authority infrastructure, cinematic media production, and digital strategy.",
    url: "https://www.abramovichmedia.com/blog",
    siteName: "Abramovich Media",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.abramovichmedia.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Abramovich Media Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Abramovich Media",
    description:
      "Insights on authority infrastructure, cinematic media production, and digital strategy.",
    images: ["https://www.abramovichmedia.com/opengraph-image"],
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Abramovich Media Blog",
  description:
    "Insights on authority infrastructure, cinematic media production, and digital strategy.",
  url: "https://www.abramovichmedia.com/blog",
  publisher: {
    "@type": "Organization",
    name: "Abramovich Media",
    url: "https://www.abramovichmedia.com",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.abramovichmedia.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: "https://www.abramovichmedia.com/blog",
    },
  ],
};

export default async function BlogPage() {
  const posts = await getAllPosts(true);

  return (
    <main className="min-h-screen bg-navy">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Blog</h1>
          <p className="text-text-muted mb-12">
            Insights on authority infrastructure, cinematic media, and digital
            strategy.
          </p>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted">No posts published yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <Link
                  key={String(post._id)}
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
                  <article className="bg-navy-light border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-56 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-white group-hover:text-accent transition-colors mb-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-text-muted text-sm leading-relaxed mb-3">
                          {post.excerpt}
                        </p>
                      )}
                      <time className="text-xs text-text-muted">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

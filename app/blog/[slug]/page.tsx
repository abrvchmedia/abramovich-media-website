import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getPostBySlug } from "@/backend/controllers/postController";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogComments from "@/components/BlogComments";

const BASE_URL = "https://www.abramovichmedia.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const postUrl = `${BASE_URL}/blog/${post.slug}`;
  const title = `${post.title} | Abramovich Media Blog`;
  const description = (post.excerpt as string) || `Read "${post.title}" on the Abramovich Media blog.`;
  const tags = (post.tags as string[]) || [];

  return {
    title,
    description,
    keywords: tags.length > 0 ? tags : undefined,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName: "Abramovich Media",
      type: "article",
      locale: "en_US",
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: post.updatedAt
        ? new Date(post.updatedAt as string).toISOString()
        : undefined,
      authors: ["Abramovich Media"],
      tags: tags.length > 0 ? tags : undefined,
      ...(post.coverImage ? { images: [{ url: post.coverImage, alt: post.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const content = typeof post.content === "string" ? post.content : "";
  const tags = (post.tags as string[]) || [];
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: (post.excerpt as string) || "",
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: post.updatedAt
      ? new Date(post.updatedAt as string).toISOString()
      : new Date(post.createdAt).toISOString(),
    wordCount,
    ...(tags.length > 0 ? { keywords: tags.join(", "), articleSection: tags[0] } : {}),
    author: {
      "@type": "Organization",
      name: "Abramovich Media",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Abramovich Media",
      url: BASE_URL,
      ...(post.coverImage
        ? { logo: { "@type": "ImageObject", url: `${BASE_URL}/opengraph-image` } }
        : {}),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
    ...(post.coverImage
      ? {
          image: {
            "@type": "ImageObject",
            url: post.coverImage,
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${BASE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${BASE_URL}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-navy">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="text-sm text-text-muted hover:text-white transition-colors mb-6 inline-block"
          >
            ← Back to blog
          </Link>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full rounded-xl object-cover mb-8 max-h-96"
            />
          )}

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-text-muted mb-6">{post.excerpt}</p>
          )}

          <time className="text-sm text-text-muted block mb-10">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>

          <div className="prose prose-invert prose-lg max-w-none text-text-muted leading-relaxed whitespace-pre-wrap">
            {content}
          </div>

          <BlogComments slug={post.slug} />
        </div>
      </article>
      <Footer />
    </main>
  );
}

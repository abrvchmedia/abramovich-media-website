import { MetadataRoute } from "next";
import { getAllPosts } from "@/backend/controllers/postController";

const BASE_URL = "https://www.abramovichmedia.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPosts: MetadataRoute.Sitemap = [];

  try {
    const posts = await getAllPosts(true);
    blogPosts = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt
        ? new Date(post.updatedAt as string)
        : new Date(post.createdAt as string),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable — still return static routes so Google always gets a valid sitemap
  }

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...blogPosts,
  ];
}

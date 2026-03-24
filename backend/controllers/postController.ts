import dbConnect from "@/backend/utils/dbConnect";
import Post from "@/backend/models/Post";
import { slugify } from "@/backend/utils/slugify";

export async function getAllPosts(publishedOnly = false) {
  await dbConnect();
  const filter = publishedOnly ? { status: "published" } : {};
  return Post.find(filter).sort({ createdAt: -1 }).lean();
}

export async function getPostById(id: string) {
  await dbConnect();
  return Post.findById(id).lean();
}

export async function getPostBySlug(slug: string) {
  await dbConnect();
  return Post.findOne({ slug, status: "published" }).lean();
}

export async function createPost(data: Record<string, unknown>) {
  await dbConnect();
  const postData = { ...data };
  if (!postData.slug && typeof postData.title === "string") {
    postData.slug = slugify(postData.title);
  }
  return Post.create(postData);
}

export async function updatePost(id: string, data: Record<string, unknown>) {
  await dbConnect();
  return Post.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deletePost(id: string) {
  await dbConnect();
  return Post.findByIdAndDelete(id);
}

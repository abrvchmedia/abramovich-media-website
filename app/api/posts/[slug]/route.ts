import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/backend/controllers/postController";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const post = await getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

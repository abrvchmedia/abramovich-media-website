import { NextResponse } from "next/server";
import { getAllPosts } from "@/backend/controllers/postController";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getAllPosts(true);
    return NextResponse.json(posts);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch posts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

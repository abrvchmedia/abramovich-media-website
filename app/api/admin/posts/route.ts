import { NextRequest, NextResponse } from "next/server";
import {
  getAllPosts,
  createPost,
} from "@/backend/controllers/postController";

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch posts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    const post = await createPost(data);
    return NextResponse.json(post, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create post";
    const status = message.includes("duplicate") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

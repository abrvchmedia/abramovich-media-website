import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/utils/dbConnect";
import Comment from "@/backend/models/Comment";
import Post from "@/backend/models/Post";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await dbConnect();

    const comments = await Comment.find({ postSlug: slug })
      .sort({ createdAt: -1 })
      .lean();

    const total = comments.length;
    const averageRating =
      total > 0
        ? comments.reduce((sum, c) => sum + (c.rating as number), 0) / total
        : 0;

    return NextResponse.json({ comments, averageRating, total });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await dbConnect();

    const post = await Post.findOne({ slug, status: "published" }).lean();
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, text, rating } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 }
      );
    }
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const comment = await Comment.create({
      postSlug: slug,
      name: name.trim().slice(0, 100),
      text: text.trim().slice(0, 2000),
      rating: Math.round(rating),
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

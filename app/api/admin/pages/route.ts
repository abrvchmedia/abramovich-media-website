import { NextRequest, NextResponse } from "next/server";
import {
  getAllPages,
  createPage,
} from "@/backend/controllers/pageController";

export async function GET() {
  try {
    const pages = await getAllPages();
    return NextResponse.json(pages);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch pages";
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
    const page = await createPage(data);
    return NextResponse.json(page, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create page";
    const status = message.includes("duplicate") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getPageBySlug } from "@/backend/controllers/pageController";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const page = await getPageBySlug(slug);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    return NextResponse.json(page);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch page";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

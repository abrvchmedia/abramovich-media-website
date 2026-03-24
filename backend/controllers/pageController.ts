import dbConnect from "@/backend/utils/dbConnect";
import Page from "@/backend/models/Page";
import { slugify } from "@/backend/utils/slugify";

export async function getAllPages() {
  await dbConnect();
  return Page.find().sort({ updatedAt: -1 }).lean();
}

export async function getPageById(id: string) {
  await dbConnect();
  return Page.findById(id).lean();
}

export async function getPageBySlug(slug: string) {
  await dbConnect();
  return Page.findOne({ slug, status: "published" }).lean();
}

export async function createPage(data: Record<string, unknown>) {
  await dbConnect();
  const pageData = { ...data };
  if (!pageData.slug && typeof pageData.title === "string") {
    pageData.slug = slugify(pageData.title);
  }
  return Page.create(pageData);
}

export async function updatePage(id: string, data: Record<string, unknown>) {
  await dbConnect();
  return Page.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deletePage(id: string) {
  await dbConnect();
  return Page.findByIdAndDelete(id);
}

export async function addBlock(
  pageId: string,
  block: { type: string; content?: Record<string, unknown> }
) {
  await dbConnect();
  const page = await Page.findById(pageId);
  if (!page) throw new Error("Page not found");

  const maxOrder =
    page.blocks.length > 0
      ? Math.max(...page.blocks.map((b: { order: number }) => b.order))
      : -1;

  const newBlock = {
    id: crypto.randomUUID(),
    type: block.type as "text" | "image" | "hero" | "cta" | "grid",
    content: block.content || {},
    order: maxOrder + 1,
  };

  page.blocks.push(newBlock);
  await page.save();
  return page.toObject();
}

export async function updateBlock(
  pageId: string,
  blockId: string,
  updates: Record<string, unknown>
) {
  await dbConnect();
  const page = await Page.findById(pageId);
  if (!page) throw new Error("Page not found");

  const block = page.blocks.find((b: { id: string }) => b.id === blockId);
  if (!block) throw new Error("Block not found");

  if (updates.content) block.content = updates.content as Record<string, unknown>;
  if (updates.type) block.type = updates.type as "text" | "image" | "hero" | "cta" | "grid";

  page.markModified("blocks");
  await page.save();
  return page.toObject();
}

export async function deleteBlock(pageId: string, blockId: string) {
  await dbConnect();
  const page = await Page.findById(pageId);
  if (!page) throw new Error("Page not found");

  page.blocks = page.blocks.filter((b: { id: string }) => b.id !== blockId);
  page.blocks.forEach((b: { order: number }, i: number) => (b.order = i));

  page.markModified("blocks");
  await page.save();
  return page.toObject();
}

export async function reorderBlocks(pageId: string, blockIds: string[]) {
  await dbConnect();
  const page = await Page.findById(pageId);
  if (!page) throw new Error("Page not found");

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const blockMap = new Map<string, any>(
    page.blocks.map((b: any) => [b.id, b])
  );
  page.blocks = blockIds
    .map((id, i) => {
      const block = blockMap.get(id);
      if (block) block.order = i;
      return block;
    })
    .filter(Boolean) as typeof page.blocks;

  page.markModified("blocks");
  await page.save();
  return page.toObject();
}

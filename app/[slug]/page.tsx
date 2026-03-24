import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPageBySlug } from "@/backend/controllers/pageController";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};

  const title = (page.seoTitle as string) || (page.title as string);
  const description = (page.seoDescription as string) || undefined;
  const pageUrl = `https://www.abramovichmedia.com/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Abramovich Media",
      type: "website",
    },
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const blocks = (page.blocks as any[]) || [];

  return (
    <main className="min-h-screen bg-navy">
      <Navbar />
      <div className="pt-20">
        <BlockRenderer blocks={blocks} />
      </div>
      <Footer />
    </main>
  );
}

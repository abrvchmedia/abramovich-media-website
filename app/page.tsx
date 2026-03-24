import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AuthorityPositioning from "@/components/AuthorityPositioning";
import Portfolio from "@/components/Portfolio";
import CoreOffers from "@/components/CoreOffers";
import AuditSection from "@/components/AuditSection";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/backend/controllers/postController";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Abramovich Media | Authority Infrastructure Studio",
  description:
    "We turn obsessive talent into undeniable authority. Cinematic video production, web development, brand films, and digital authority systems that convert attention into revenue.",
  alternates: {
    canonical: "https://www.abramovichmedia.com",
  },
  openGraph: {
    title: "Abramovich Media | Authority Infrastructure Studio",
    description:
      "We turn obsessive talent into undeniable authority. Cinematic media, full-stack infrastructure, and scalable distribution systems.",
    url: "https://www.abramovichmedia.com",
    type: "website",
  },
};

export default async function Home() {
  const posts = await getAllPosts(true);

  const serialized = posts.map((p) => ({
    _id: String(p._id),
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    createdAt: String(p.createdAt),
  }));

  return (
    <main className="min-h-screen bg-navy">
      <Navbar />
      <Hero />
      <AuthorityPositioning />
      <Portfolio />
      <CoreOffers />
      <AuditSection />
      <Blog posts={serialized} />
      <Contact />
      <Footer />
    </main>
  );
}

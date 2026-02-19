import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AuthorityPositioning from "@/components/AuthorityPositioning";
import Portfolio from "@/components/Portfolio";
import CoreOffers from "@/components/CoreOffers";
import AuditSection from "@/components/AuditSection";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-navy">
      <Navbar />
      <Hero />
      <AuthorityPositioning />
      <Portfolio />
      <CoreOffers />
      <AuditSection />
      <Blog />
      <Contact />
      <Footer />
    </main>
  );
}

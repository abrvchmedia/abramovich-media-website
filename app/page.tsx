import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AuthorityPositioning from "@/components/AuthorityPositioning";
import CoreOffers from "@/components/CoreOffers";
import AuditSection from "@/components/AuditSection";
import Portfolio from "@/components/Portfolio";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-navy">
      <Navbar />
      <Hero />
      <AuthorityPositioning />
      <CoreOffers />
      <AuditSection />
      <Portfolio />
      <Blog />
      <Contact />
      <Footer />
    </main>
  );
}

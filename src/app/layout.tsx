import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Abramovich Media LLC - Visuals That Scale Your Vision",
  description: "We plan, shoot, edit, and ship content that performs on social and converts on your site. Professional video production and social media content creation.",
  keywords: ["video production", "social media content", "cinematic", "editing", "media production"],
  authors: [{ name: "Abramovich Media LLC" }],
  openGraph: {
    title: "Abramovich Media LLC - Visuals That Scale Your Vision",
    description: "We plan, shoot, edit, and ship content that performs on social and converts on your site.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abramovich Media LLC - Visuals That Scale Your Vision",
    description: "We plan, shoot, edit, and ship content that performs on social and converts on your site.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

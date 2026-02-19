import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abramovich Media | Authority Infrastructure Studio",
  description:
    "We build cinematic media, digital infrastructure, and scalable authority systems that convert attention into revenue. Authority Engine for obsessives.",
  keywords: [
    "authority infrastructure",
    "cinematic media production",
    "digital infrastructure studio",
    "brand authority systems",
    "Next.js builds",
    "SEO authority",
    "Abramovich Media",
  ],
  authors: [{ name: "Abramovich Media LLC" }],
  creator: "Abramovich Media LLC",
  metadataBase: new URL("https://www.abramovichmedia.com"),
  openGraph: {
    title: "Abramovich Media | Authority Infrastructure Studio",
    description:
      "We turn obsessive talent into undeniable authority. Cinematic media, full-stack infrastructure, and scalable distribution systems.",
    url: "https://www.abramovichmedia.com",
    siteName: "Abramovich Media",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abramovich Media | Authority Infrastructure Studio",
    description:
      "We turn obsessive talent into undeniable authority. Cinematic media, full-stack infrastructure, and scalable distribution systems.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy text-white antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const BASE_URL = "https://www.abramovichmedia.com";

export const metadata: Metadata = {
  title: {
    default: "Abramovich Media | Authority Infrastructure Studio",
    template: "%s | Abramovich Media",
  },
  description:
    "We build cinematic media, digital infrastructure, and scalable authority systems that convert attention into revenue. Authority Engine for obsessives.",
  keywords: [
    "authority infrastructure",
    "cinematic media production",
    "cinematic brand film",
    "video production agency",
    "digital infrastructure studio",
    "brand authority systems",
    "luxury brand video production",
    "web development agency",
    "SEO authority",
    "Abramovich Media",
  ],
  authors: [{ name: "Abramovich Media LLC" }],
  creator: "Abramovich Media LLC",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Abramovich Media | Authority Infrastructure Studio",
    description:
      "We turn obsessive talent into undeniable authority. Cinematic media, full-stack infrastructure, and scalable distribution systems.",
    url: BASE_URL,
    siteName: "Abramovich Media",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Abramovich Media — Authority Infrastructure Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abramovich Media | Authority Infrastructure Studio",
    description:
      "We turn obsessive talent into undeniable authority. Cinematic media, full-stack infrastructure, and scalable distribution systems.",
    images: [`${BASE_URL}/opengraph-image`],
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Abramovich Media",
  legalName: "Abramovich Media LLC",
  url: BASE_URL,
  logo: `${BASE_URL}/opengraph-image`,
  description:
    "Premium creative agency combining cinematic video production, web development, and digital brand authority systems.",
  email: "abramovichmedia@gmail.com",
  telephone: "+1-623-218-3990",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-623-218-3990",
    contactType: "sales",
    email: "abramovichmedia@gmail.com",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Abramovich Media",
  url: BASE_URL,
  description:
    "Authority Infrastructure Studio — cinematic media, digital infrastructure, and scalable authority systems.",
  publisher: {
    "@type": "Organization",
    name: "Abramovich Media",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Abramovich Media",
  url: BASE_URL,
  description:
    "Premium creative agency specializing in cinematic video production, brand films, web development, and digital authority systems for luxury brands, startups, and high-ticket businesses.",
  email: "abramovichmedia@gmail.com",
  telephone: "+1-623-218-3990",
  priceRange: "$$$",
  serviceType: [
    "Cinematic Video Production",
    "Brand Film Production",
    "Web Development",
    "Digital Brand Authority",
    "Commercial Campaign Production",
    "SEO & Digital Infrastructure",
  ],
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
      </head>
      <body className="bg-navy text-white antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

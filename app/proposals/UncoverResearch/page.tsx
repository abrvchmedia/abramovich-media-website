import type { Metadata } from "next";
import UncoverResearchProposalPage from "@/components/proposals/UncoverResearchProposalPage";

const BASE = "https://www.abramovichmedia.com";

export const metadata: Metadata = {
  title: "Proposal | Uncover Research",
  description:
    "Private field-capture proposal for Uncover Research (Rothy's — Scottsdale).",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: `${BASE}/proposals/UncoverResearch`,
  },
  openGraph: {
    title: "Private proposal | Abramovich Media",
    description: "Confidential proposal — Uncover Research.",
    url: `${BASE}/proposals/UncoverResearch`,
    type: "website",
  },
};

export default function UncoverResearchProposalRoute() {
  return <UncoverResearchProposalPage />;
}

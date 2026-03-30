"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProposalPdfViewer from "@/components/proposals/ProposalPdfViewer";

const PROPOSAL_PDF = "/proposals/uncover-research-field-capture.pdf";
const W9_PDF = "/proposals/jonathan-abramovich-w9.pdf";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export default function UncoverResearchProposalPage() {
  return (
    <main className="min-h-screen bg-navy">
      <Navbar />
      <div className="pt-24 md:pt-28 pb-16">
        <div className="container-brand px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-10"
          >
            <p className="eyebrow mb-3">Confidential · Field production</p>
            <h1 className="section-heading !text-[clamp(1.5rem,4vw,2.25rem)] mb-4">
              Scottsdale capture proposal
            </h1>
            <p className="muted-text text-sm font-medium uppercase tracking-[0.2em]">
              Prepared for Uncover Research — Rothy&apos;s Customer Aesthetic
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="space-y-6 mb-14"
          >
            <p className="body-text text-[1.05rem] leading-[1.85] text-gray-100">
              Thank you for the opportunity to shoot video for these day shoots. This
              study sits exactly where I like to work: real homes, real wardrobes, and a
              dinner environment where the room still has to feel elevated—without ever
              making participants perform for the camera. My default is to protect the
              integrity of the conversation while building a{" "}
              <strong className="text-white font-semibold">visual library</strong> your
              editors can actually cut with: clean audio, consistent exposure, and
              detail in the product and environment that reads on a big screen—not just
              on a phone.
            </p>
            <p className="body-text text-[1.05rem] leading-[1.85] text-gray-100">
              Most of my recent depth is in{" "}
              <strong className="text-accent font-semibold">
                branded fashion and lifestyle
              </strong>
              ,{" "}
              <strong className="text-white font-semibold">
                live and staged events
              </strong>
              , and the kind of{" "}
              <strong className="text-white font-semibold">
                cinematic B-roll
              </strong>{" "}
              that has to sell texture, silhouette, and context in a few seconds. That
              maps cleanly to closets, pairs on shelves, and the small rituals of how
              someone gets dressed—without turning the shoot into a fashion campaign that
              fights the research. Below is the formal scope and structure; I&apos;m
              doing a last pass on the{" "}
              <strong className="text-white font-semibold">numbers in the official PDF</strong>{" "}
              before it goes to your team for signature, so what you download may reflect
              the final investment. If anything needs to move to match procurement or
              timeline, reply with constraints and I&apos;ll turn around a tight revision.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
          >
            <ProposalPdfViewer
              file={PROPOSAL_PDF}
              title="Uncover Research — Field capture (Scottsdale)"
              w9File={W9_PDF}
              w9Label="W-9"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="muted-text mt-8 text-center text-xs uppercase tracking-[0.2em]"
          >
            This URL is private — not indexed for search
          </motion.p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

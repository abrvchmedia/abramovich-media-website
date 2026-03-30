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
            <p className="eyebrow mb-3">Confidential · Field cinematography</p>
            <h1 className="section-heading !text-[clamp(1.5rem,4vw,2.25rem)] mb-4">
              Cinematography field capture proposal
            </h1>
            <p className="muted-text text-sm font-medium uppercase tracking-[0.2em]">
              Prepared for Uncover Research — Rothy&apos;s Customer Aesthetic
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="space-y-8 mb-12"
          >
            <p className="body-text text-[1.05rem] leading-[1.85] text-gray-100">
              Thank you for trusting this capture to Abramovich Media. These days sit
              where I do my best work: real homes, real wardrobes, and a dinner table
              that still has to feel elevated—without asking anyone to perform for the
              camera.
            </p>
            <p className="body-text text-[1.05rem] leading-[1.85] text-gray-100">
              <strong className="text-white font-semibold">Day rates are built long</strong>{" "}
              on purpose—buffer for resets, wardrobe changes, and{" "}
              <strong className="text-white font-semibold">set moves</strong> so we are
              not racing the clock when the room matters.
            </p>
            <p className="body-text text-[1.05rem] leading-[1.85] text-gray-100">
              <strong className="text-accent font-semibold">
                Same-day footage handoff:
              </strong>{" "}
              I duplicate and organize masters onto{" "}
              <strong className="text-white font-semibold">
                my own drive, which I bring on set
              </strong>
              , and I hand that drive{" "}
              <strong className="text-white font-semibold">
                in person to your CEO or project manager
              </strong>{" "}
              when we wrap—ahead of a 48-hour ship if you want the files that night.
            </p>
            <p className="body-text text-[1.05rem] leading-[1.85] text-gray-100">
              Uncover and Rothy&apos;s both hold a high bar for how brand shows up in the
              world. That makes{" "}
              <strong className="text-white font-semibold">on-set judgment</strong> as
              important as the kit: protecting participants, keeping the room honest, and
              building a{" "}
              <strong className="text-white font-semibold">
                cinema-grade library
              </strong>{" "}
              your editors can cut—clean audio, consistent exposure, detail in product
              and environment.
            </p>
            <p className="body-text text-[1.05rem] leading-[1.85] text-gray-100">
              Depth-wise, I live in{" "}
              <strong className="text-accent font-semibold">
                branded fashion and lifestyle
              </strong>
              , live and staged environments, and B-roll that has to sell texture and
              silhouette fast—so closets, shelves, and small rituals of getting dressed
              read premium without turning the study into a campaign shoot.
            </p>
            <p className="body-text text-[1.05rem] leading-[1.85] text-gray-100 border-l-2 border-accent/60 pl-5">
              The formal scope, schedule, and investment are in the PDF below.{" "}
              <strong className="text-white font-semibold">
                My W-9 is downloadable below
              </strong>{" "}
              next to the proposal actions. If procurement or timing needs a tweak, reply
              with constraints—I&apos;ll turn a tight revision quickly.
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

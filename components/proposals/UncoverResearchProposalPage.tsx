"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProposalPdfViewer from "@/components/proposals/ProposalPdfViewer";

const PDF_PATH = "/proposals/uncover-research-field-capture.pdf";

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
              You did not get a rate card—you got a{" "}
              <strong className="text-white font-semibold">named outcome</strong>{" "}
              with a clear finish line, because that is how{" "}
              <strong className="text-accent font-semibold">authority is earned</strong>{" "}
              before money changes hands: the same{" "}
              <em className="text-gray-200 not-italic">audit-first</em> posture we use
              when we crawl what the market can actually see—evidence on the page, no
              invented metrics—is how premium buyers decide they can trust you with{" "}
              <strong className="text-white font-semibold">
                affluent participants
              </strong>{" "}
              and a <strong className="text-white font-semibold">Rothy&apos;s</strong>
              -tier brand moment. Robert Cialdini&apos;s work on{" "}
              <strong className="text-white font-semibold">reciprocity</strong> is not a
              gimmick here; when someone hands you real diagnostic structure before you
              pay, the natural response is to match that seriousness—and his research on{" "}
              <strong className="text-white font-semibold">
                commitment and consistency
              </strong>{" "}
              shows that a decisive first yes—scoped deposit and executed terms—is what
              turns intent into <strong className="text-white font-semibold">locked</strong>{" "}
              calendar reality instead of another polite thread that never commits.
            </p>
            <p className="body-text text-[1.05rem] leading-[1.85] text-gray-100">
              <strong className="text-accent font-semibold">ClickFunnels</strong>-grade
              offer architecture means{" "}
              <strong className="text-white font-semibold">one dominant decision</strong>{" "}
              with friction stripped out: choose the tier that matches how much{" "}
              <strong className="text-white font-semibold">certainty</strong> you want on
              ingest and verification, then move—because{" "}
              <strong className="text-white font-semibold">time delay</strong> and{" "}
              <strong className="text-white font-semibold">effort</strong> are the silent
              killers of closed deals (the same{" "}
              <em className="text-gray-200 not-italic">value equation</em> logic Hormozi
              hammers: widen perceived outcome, raise likelihood, shrink delay and
              sacrifice). Our{" "}
              <strong className="text-white font-semibold">Authority Engine</strong>{" "}
              follow-up standard rejects hollow &quot;just checking in&quot;; we run{" "}
              <strong className="text-white font-semibold">certainty transfer</strong>—
              forward motion that answers what blocks the next step. Scroll the embedded
              proposal, <strong className="text-white font-semibold">download</strong> it
              for accounting if you need, then{" "}
              <strong className="text-cta font-semibold">reply with your tier</strong>:
              the moment you do, ambiguity converts into{" "}
              <strong className="text-white font-semibold">Scottsdale dates held</strong>,
              gear allocated, and{" "}
              <strong className="text-white font-semibold">editor-ready masters</strong>—
              without rebuilding the brief from zero.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
          >
            <ProposalPdfViewer
              file={PDF_PATH}
              title="Uncover Research — Field capture (Scottsdale)"
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

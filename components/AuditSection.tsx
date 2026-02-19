"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 } },
};

const staggerList: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
};

const listItem: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const deliverables = [
  "Competitive SEO map",
  "Authority score breakdown",
  "Funnel audit",
  "Revenue scaling blueprint",
  "Infrastructure recommendations",
];

export default function AuditSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="audit"
      className="section-wrap relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a160a 0%, #0B1120 50%, #0B1120 100%)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-cta/20" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-cta/20" />
      {/* Subtle green ambient */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cta/[0.04] blur-[120px] pointer-events-none" />

      <div ref={ref} className="container-brand relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <span className="eyebrow text-cta/80 block mb-5">Start Here</span>
            <h2 className="section-heading text-white mb-2 leading-tight">
              Start With A{" "}
              <span className="text-cta">7-Day Authority Gap Audit</span>
            </h2>
            <p className="body-text text-gray-400 mt-6 mb-10">
              We analyze your positioning, digital footprint, keyword authority,
              funnel leakage, and infrastructure gaps — then deliver a roadmap
              to scale your authority and revenue.
            </p>
            <a href="#contact" className="btn-cta">
              Book Your Audit
            </a>
          </motion.div>

          {/* Right — deliverables */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <p className="eyebrow text-cta/70 block mb-6">What You Receive</p>
            <motion.div
              variants={staggerList}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-col gap-3"
            >
              {deliverables.map((item) => (
                <motion.div
                  key={item}
                  variants={listItem}
                  className="brand-card flex items-center gap-4 px-5 py-4 hover:border-cta/20"
                >
                  <div className="w-8 h-8 rounded-full bg-cta/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white font-medium text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

export default function Blog() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="blog" className="section-wrap relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />

      <div className="container-brand">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.span variants={fadeUp} className="eyebrow block mb-5">
            Insights
          </motion.span>
          <motion.h2 variants={fadeUp} className="section-heading mb-12">
            Insights
          </motion.h2>

          {/* Placeholder blog card */}
          <motion.div
            variants={fadeUp}
            className="brand-card relative p-8 md:p-10 max-w-2xl overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/40 to-transparent" />
            <span className="eyebrow text-accent/50 text-[10px] block mb-4">
              Coming Soon
            </span>
            <h3 className="font-black uppercase tracking-[0.05em] text-white text-xl md:text-2xl mb-3">
              The Authority Gap: Why Most Experts Are Invisible Online
            </h3>
            <p className="muted-text text-sm mb-6">
              A deep dive into the systemic infrastructure failures that keep
              high-caliber talent undiscoverable — and how to fix them.
            </p>
            <span className="eyebrow text-[10px] text-gray-400/30">
              SEO Authority Blog System — Launching Soon
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

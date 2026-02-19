"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy"
    >
      {/* Cinematic background */}
      <div className="absolute inset-0 z-0">
        {/* Dark overlay gradient as specified */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(11,17,32,0.95))",
          }}
        />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#F5E50A 1px, transparent 1px), linear-gradient(90deg, #F5E50A 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full bg-accent/[0.04] blur-[140px] pointer-events-none" />
      </div>

      {/* Content — max-width 900px as specified */}
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={container}>
          {/* Eyebrow */}
          <motion.span
            variants={fadeUp}
            className="eyebrow inline-block border border-accent/20 px-4 py-1.5 rounded-sm mb-8"
          >
            Authority Infrastructure Studio
          </motion.span>

          {/* Main headline */}
          <motion.h1 variants={fadeUp} className="hero-heading mb-6">
            We Turn Obsessive{" "}
            <span className="text-white">Talent Into</span>
            <br />
            Undeniable Authority.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="muted-text max-w-2xl mx-auto mb-10 text-base md:text-lg"
          >
            We build cinematic media, digital infrastructure, and scalable
            authority systems that convert attention into revenue.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={scaleIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#portfolio" className="btn-secondary w-full sm:w-auto">
              View Portfolio
            </a>
            <a href="#audit" className="btn-cta w-full sm:w-auto">
              Start Authority Audit
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="eyebrow text-[10px] opacity-40">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-accent/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}

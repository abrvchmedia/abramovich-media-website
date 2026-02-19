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

const pillars = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 10l4.553-2.069A1 1 0 0121 8.82V15a1 1 0 01-.553.894L15 18M9 6l-4.553 2.069A1 1 0 003 9.18V15a1 1 0 00.553.894L9 18m6-12l-6 0m6 12l-6 0" />
      </svg>
    ),
    title: "Cinematic Media",
    description:
      "High-end video production, brand storytelling, and VFX-driven positioning that commands attention and builds undeniable authority.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Digital Infrastructure",
    description:
      "Custom Next.js builds, Stripe integration, subscription systems, and SEO architecture engineered to convert and scale.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Scalable Distribution",
    description:
      "Authority-based SEO, backlink building, analytics dashboards, and performance tracking that compound over time.",
  },
];

export default function AuthorityPositioning() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="authority" className="section-wrap relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-accent/[0.03] blur-[120px] pointer-events-none" />

      <div className="container-brand relative">
        {/* Header */}
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-3xl mb-16"
        >
          <motion.span variants={fadeUp} className="eyebrow block mb-5">
            What We Build
          </motion.span>
          <motion.h2 variants={fadeUp} className="section-heading mb-6">
            The Authority Engine
          </motion.h2>
          <motion.p variants={fadeUp} className="body-text text-gray-400">
            The Authority Engine is our hybrid system combining cinematic
            storytelling, full-stack digital infrastructure, and
            performance-driven distribution.
          </motion.p>
          <motion.p variants={fadeUp} className="body-text mt-4">
            It&apos;s not just content.{" "}
            <span className="text-accent font-bold">
              It&apos;s positioning, systems, and scale.
            </span>
          </motion.p>
        </motion.div>

        {/* Pillar cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={fadeUp}
              className="brand-card p-8 group relative overflow-hidden"
            >
              {/* Accent bottom line on hover */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-accent/50 transition-all duration-500" />
              <div className="text-accent mb-5">{pillar.icon}</div>
              <h3 className="font-black uppercase tracking-[0.05em] text-white text-lg mb-3">
                {pillar.title}
              </h3>
              <p className="muted-text text-sm">{pillar.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

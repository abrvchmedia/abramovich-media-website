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

const projects = [
  {
    number: "Project 01",
    title: "Cinematic Authority Build",
    category: "Brand Film · Identity",
    description:
      "Full cinematic brand story, visual identity system, and hero launch film for a positioning-led founder.",
    thumbBg: "bg-gradient-to-br from-secondary/30 to-backgroundLight",
  },
  {
    number: "Project 02",
    title: "Infrastructure System",
    category: "Next.js · Stripe · SEO",
    description:
      "Full-stack digital infrastructure with subscription commerce, SEO architecture, and analytics pipeline.",
    thumbBg: "bg-gradient-to-br from-purple-900/40 to-backgroundLight",
  },
  {
    number: "Project 03",
    title: "Hybrid Campaign",
    category: "Distribution · Authority",
    description:
      "Multi-channel authority campaign combining cinematic content, SEO domination, and paid amplification.",
    thumbBg: "bg-gradient-to-br from-cta/20 to-backgroundLight",
  },
];

export default function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="portfolio" className="section-wrap relative overflow-hidden">
      <div className="container-brand">
        {/* Header */}
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.span variants={fadeUp} className="eyebrow block mb-5">
            Our Work
          </motion.span>
          <motion.h2 variants={fadeUp} className="section-heading">
            Selected Work
          </motion.h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={fadeUp}
              className="brand-card group flex flex-col overflow-hidden"
            >
              {/* Thumbnail */}
              <div className={`h-52 ${project.thumbBg} relative flex items-center justify-center`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-accent/[0.04]" />
                <span className="eyebrow text-[10px] text-white/20">{project.number}</span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 p-7 flex-1">
                <span className="eyebrow text-accent/60 text-[10px]">
                  {project.category}
                </span>
                <h3 className="font-black uppercase tracking-[0.05em] text-white text-lg">
                  {project.title}
                </h3>
                <p className="muted-text text-sm flex-1">{project.description}</p>
                <button className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-accent/70 hover:text-accent transition-colors w-fit group/btn">
                  View Case Study
                  <svg
                    className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center muted-text text-xs tracking-[0.2em] uppercase"
        >
          Additional projects launching soon.
        </motion.p>
      </div>
    </section>
  );
}

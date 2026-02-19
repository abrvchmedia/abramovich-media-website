"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState } from "react";

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
    id: "CELPdp9hXZU",
    number: "Project 01",
    title: "Cinematic Authority Build",
    category: "Brand Film · Identity",
    description:
      "Full cinematic brand story, visual identity system, and hero launch film for a positioning-led founder.",
  },
  {
    id: "1-eL2m4jjYk",
    number: "Project 02",
    title: "Infrastructure System",
    category: "Production · Campaign",
    description:
      "Full-stack digital infrastructure with subscription commerce, SEO architecture, and analytics pipeline.",
  },
  {
    id: "oSSsYl-Ij-s",
    number: "Project 03",
    title: "Hybrid Campaign",
    category: "Distribution · Authority",
    description:
      "Multi-channel authority campaign combining cinematic content, SEO domination, and paid amplification.",
  },
];

function VideoModal({
  videoId,
  onClose,
}: {
  videoId: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-widest"
        >
          Close
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 16:9 YouTube embed */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-xl"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title="Portfolio Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({
  project,
  onPlay,
}: {
  project: (typeof projects)[0];
  onPlay: () => void;
}) {
  // hqdefault is always available; maxresdefault may 404 for some videos
  const thumbnailUrl = `https://img.youtube.com/vi/${project.id}/hqdefault.jpg`;
  const fallbackUrl  = `https://img.youtube.com/vi/${project.id}/mqdefault.jpg`;

  return (
    <motion.div
      variants={fadeUp}
      className="brand-card group flex flex-col overflow-hidden cursor-pointer"
      onClick={onPlay}
    >
      {/* Thumbnail */}
      <div className="relative h-52 overflow-hidden bg-navy-light">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt={project.title}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackUrl; }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center shadow-lg"
          >
            <svg className="w-6 h-6 text-navy ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>
        </div>

        {/* Number badge */}
        <span className="absolute top-4 left-4 eyebrow text-[10px] text-white/40">
          {project.number}
        </span>
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
        <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-accent/70 group-hover:text-accent transition-colors w-fit">
          Watch Film
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

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
            <ProjectCard
              key={project.id}
              project={project}
              onPlay={() => setActiveVideo(project.id)}
            />
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

      {/* Video modal */}
      {activeVideo && (
        <VideoModal
          videoId={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  );
}

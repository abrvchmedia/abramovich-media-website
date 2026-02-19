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

const offers = [
  {
    number: "01",
    title: "Authority Foundation",
    tagline: "Your brand's cinematic launchpad.",
    deliverables: [
      "Cinematic hero film",
      "Brand positioning system",
      "Landing page build",
      "Funnel + analytics setup",
      "Launch strategy",
    ],
  },
  {
    number: "02",
    title: "Authority Engine Build",
    tagline: "Full-stack infrastructure for authority at scale.",
    deliverables: [
      "Full-stack commerce build (Next.js + Stripe)",
      "SEO authority setup",
      "Subscription system",
      "Conversion optimization",
      "Content infrastructure",
    ],
    featured: true,
  },
  {
    number: "03",
    title: "Growth Infrastructure Partnership",
    tagline: "Ongoing expansion, compounding returns.",
    deliverables: [
      "Ongoing authority expansion",
      "Backlink + SEO scaling",
      "Paid demand amplification",
      "Performance dashboards",
      "Revenue-aligned growth strategy",
    ],
  },
];

export default function CoreOffers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="offers" className="section-wrap relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />

      <div className="container-brand relative">
        {/* Section header */}
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="eyebrow block mb-5">
            How We Engage
          </motion.span>
          <motion.h2 variants={fadeUp} className="section-heading">
            Our Engagement Models
          </motion.h2>
        </motion.div>

        {/* Offer cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6 mb-14"
        >
          {offers.map((offer) => (
            <motion.div
              key={offer.title}
              variants={fadeUp}
              className={`brand-card relative flex flex-col p-8 md:p-10 ${
                offer.featured
                  ? "border-accent/25 bg-accent/[0.04] hover:border-accent/40"
                  : ""
              }`}
            >
              {/* Featured top accent line */}
              {offer.featured && (
                <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              )}

              <span className="eyebrow text-[10px] opacity-40 block mb-4">
                {offer.number}
              </span>
              <h3 className="font-black uppercase tracking-[0.05em] text-white text-2xl md:text-3xl mb-2">
                {offer.title}
              </h3>
              <p className="muted-text text-sm mb-8">{offer.tagline}</p>

              <ul className="flex flex-col gap-3 flex-1">
                {offer.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                    <svg
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${offer.featured ? "text-accent" : "text-cta"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center"
        >
          <a href="#audit" className="btn-cta">
            Apply for Authority Audit
          </a>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState } from "react";

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const reasons = [
  "Revenue-first positioning",
  "Cinematic authority differentiation",
  "Full-stack infrastructure capability",
  "Performance-aligned growth",
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    "w-full px-5 py-4 bg-navyLight border border-white/5 focus:border-accent/30 rounded-xl text-white placeholder-gray-400/40 text-sm outline-none transition-colors duration-200";

  return (
    <section id="contact" className="section-wrap relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,229,10,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div ref={ref} className="container-brand relative">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="eyebrow block mb-5">
            Let&apos;s Build
          </motion.span>
          <motion.h2 variants={fadeUp} className="section-heading">
            Start A Conversation
          </motion.h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {submitted ? (
              <div className="brand-card flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-cta/20 flex items-center justify-center mb-2">
                  <svg className="w-7 h-7 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-black uppercase tracking-[0.05em] text-white text-xl">
                  Message Sent
                </h3>
                <p className="muted-text text-sm">We&apos;ll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="eyebrow text-[10px] text-gray-400">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="eyebrow text-[10px] text-gray-400">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="eyebrow text-[10px] text-gray-400">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button type="submit" className="btn-cta w-full">
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Why Work With Us */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col justify-center gap-8"
          >
            <div>
              <p className="eyebrow block mb-6">Why Work With Us</p>
              <motion.div
                variants={stagger}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="flex flex-col gap-3"
              >
                {reasons.map((reason) => (
                  <motion.div
                    key={reason}
                    variants={fadeUp}
                    className="brand-card flex items-center gap-4 px-5 py-4"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    <span className="text-white font-medium text-sm">{reason}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="brand-card p-6">
              <p className="eyebrow text-[10px] text-gray-400 block mb-5">Direct Contact</p>
              <div className="flex flex-col gap-4">
                <a
                  href="mailto:abramovichmedia@gmail.com"
                  className="text-sm text-white/80 hover:text-accent transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-accent/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  abramovichmedia@gmail.com
                </a>
                <a
                  href="tel:6232183990"
                  className="text-sm text-white/80 hover:text-accent transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-accent/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  623-218-3990
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

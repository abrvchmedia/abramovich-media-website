"use client";

import Link from "next/link";
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

interface PostPreview {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
}

export default function Blog({ posts = [] }: { posts?: PostPreview[] }) {
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

          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <motion.div key={post._id} variants={fadeUp}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="brand-card relative p-6 md:p-8 overflow-hidden group block h-full"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/40 to-transparent" />

                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}

                    <span className="eyebrow text-accent/50 text-[10px] block mb-3">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <h3 className="font-black uppercase tracking-[0.05em] text-white text-lg md:text-xl mb-3 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="muted-text text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
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
              <p className="muted-text text-sm">
                A deep dive into the systemic infrastructure failures that keep
                high-caliber talent undiscoverable — and how to fix them.
              </p>
            </motion.div>
          )}

          {posts.length > 0 && (
            <motion.div variants={fadeUp} className="mt-8">
              <Link
                href="/blog"
                className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
              >
                View all posts →
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

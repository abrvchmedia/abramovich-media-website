"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  _id: string;
  name: string;
  text: string;
  rating: number;
  createdAt: string;
}

interface CommentsData {
  comments: Comment[];
  averageRating: number;
  total: number;
}

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  if (half) {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="#F5E50A" />
            <stop offset="50%" stopColor="#374151" />
          </linearGradient>
        </defs>
        <path
          fill="url(#halfStar)"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path
        fill={filled ? "#F5E50A" : "#374151"}
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  );
}

function StarRatingDisplay({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<StarIcon key={i} filled />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarIcon key={i} filled={false} half />);
    } else {
      stars.push(<StarIcon key={i} filled={false} />);
    }
  }
  return <div className="flex gap-0.5">{stars}</div>;
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7">
            <path
              fill={
                (hover || value) >= star ? "#F5E50A" : "#374151"
              }
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function BlogComments({ slug }: { slug: string }) {
  const [data, setData] = useState<CommentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${slug}/comments`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!text.trim()) {
      setError("Please enter a comment.");
      return;
    }
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), text: text.trim(), rating }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Something went wrong.");
        return;
      }

      setName("");
      setText("");
      setRating(0);
      setSuccess(true);
      await fetchComments();
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 border-t border-white/10 pt-12">
      {/* Aggregate rating */}
      {data && data.total > 0 && (
        <div className="flex items-center gap-3 mb-8">
          <StarRatingDisplay rating={data.averageRating} />
          <span className="text-white font-semibold text-lg">
            {data.averageRating.toFixed(1)}
          </span>
          <span className="text-text-muted text-sm">
            ({data.total} {data.total === 1 ? "review" : "reviews"})
          </span>
        </div>
      )}

      {/* Comment form */}
      <div className="bg-navy-light rounded-xl border border-white/5 p-6 mb-10">
        <h3 className="text-xl font-bold text-white mb-5">
          Leave a Comment & Rating
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-text-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1.5">
              Rating
            </label>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1.5">
              Comment
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={2000}
              rows={4}
              className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-text-muted/50 focus:outline-none focus:border-accent/50 transition-colors resize-none"
              placeholder="Share your thoughts on this article..."
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          {success && (
            <p className="text-cta text-sm">
              Comment submitted successfully!
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-cta text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {/* Comments list */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6">
          {loading
            ? "Loading comments..."
            : data && data.total > 0
            ? `Comments (${data.total})`
            : "No comments yet — be the first!"}
        </h3>

        {data?.comments.map((comment) => (
          <div
            key={comment._id}
            className="border-b border-white/5 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm uppercase">
                  {comment.name.charAt(0)}
                </div>
                <span className="text-white font-semibold text-sm">
                  {comment.name}
                </span>
              </div>
              <time className="text-text-muted text-xs">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="ml-11 mb-1.5">
              <StarRatingDisplay rating={comment.rating} />
            </div>
            <p className="ml-11 text-text-muted text-sm leading-relaxed">
              {comment.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

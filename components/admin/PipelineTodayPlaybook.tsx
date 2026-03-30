"use client";

import { useMemo } from "react";

/** Scottsdale med-spa FU2 send gates (Day 8 from cold) — adjust when you run a new batch. */
function gatesForYear(year: number) {
  return {
    cohortFirstFu1: new Date(year, 2, 31), // Mar 31
    cohortBacklog: new Date(year, 3, 2), // Apr 2
  };
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

interface Props {
  totalLeads: number;
  fu1Sent: number;
  fu2Sent: number;
}

export function PipelineTodayPlaybook({ totalLeads, fu1Sent, fu2Sent }: Props) {
  const { label, hygiene, dont, nextOne } = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const { cohortFirstFu1, cohortBacklog } = gatesForYear(y);
    const t = startOfDay(now);
    const a = startOfDay(cohortFirstFu1);
    const b = startOfDay(cohortBacklog);

    const label = now.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const hygiene = [
      "Open Gmail Drafts → search subject “one more thing” (or your FU2 subject).",
      "Spot-check 5 threads: in-reply-to correct thread, apex in subject, Drive showreel block + phone CTA present.",
      "In Gmail, star or label drafts: cohort first_fu1_15 vs backlog_36 so you never mix send days.",
      "Admin: confirm pipeline import matches your mailable list (51 Scottsdale); fix any duplicate/bounced rows.",
    ];

    const dont =
      "Do not bulk-send FU2 before each cohort’s gate unless you are deliberately breaking the Day‑8 cadence.";

    let nextOne: string;

    if (t < a) {
      nextOne =
        "Do this next only: open Gmail → pick 5 random FU2 drafts → read each full body once (threading + Drive link + 6232183990). Fix any draft before you send.";
    } else if (t >= a && t < b) {
      nextOne =
        "Do this next only: send FU2 for cohort first_fu1_15 (15 leads) — not the backlog_36 batch yet. Pace waves (e.g. 3 every 90s) if that’s your deliverability rule.";
    } else {
      nextOne =
        "Do this next only: send FU2 for cohort backlog_36 (36 leads) if first cohort is already out. Then log any replies here (stage → replied).";
    }

    return { label, hygiene, dont, nextOne };
  }, []);

  return (
    <div className="mb-6 rounded-xl border border-cta/25 bg-cta/[0.06] px-4 py-4 text-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cta">
            Today · prep & hygiene
          </p>
          <p className="text-text-muted text-xs mt-0.5">{label}</p>
        </div>
        {totalLeads > 0 && (
          <p className="text-xs text-text-muted tabular-nums">
            DB: {totalLeads} leads · fu1_sent {fu1Sent} · fu2_sent {fu2Sent}
          </p>
        )}
      </div>

      <div className="rounded-lg border border-white/10 bg-navy/40 p-3 mb-3">
        <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
          Next — one thing only
        </p>
        <p className="text-white leading-relaxed">{nextOne}</p>
      </div>

      <p className="text-xs text-text-muted mb-2 font-medium uppercase tracking-wide">
        Hygiene checklist
      </p>
      <ul className="list-disc list-inside text-text-muted space-y-1.5 text-xs sm:text-sm mb-3">
        {hygiene.map((line) => (
          <li key={line} className="leading-relaxed">
            {line}
          </li>
        ))}
      </ul>

      <p className="text-xs text-amber-200/90 border-t border-white/10 pt-3">
        <span className="font-semibold text-amber-300">Gates: </span>
        Cohort <code className="text-accent">first_fu1_15</code> FU2 from{" "}
        <strong className="text-white">Mar 31</strong> · Cohort{" "}
        <code className="text-accent">backlog_36</code> from{" "}
        <strong className="text-white">Apr 2</strong> (same calendar year as today).
        {" · "}
        {dont}
      </p>
    </div>
  );
}

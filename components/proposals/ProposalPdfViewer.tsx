"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ProposalPdfDocument = dynamic(() => import("./ProposalPdfDocument"), {
  ssr: false,
  loading: () => (
    <div className="py-20 text-center text-sm text-gray-400">
      Initializing document viewer…
    </div>
  ),
});

type Props = {
  /** Public path to PDF in /public */
  file: string;
  title: string;
};

export default function ProposalPdfViewer({ file, title }: Props) {
  const [scale, setScale] = useState(1);

  return (
    <div className="brand-card overflow-hidden border border-white/10 bg-navy-light/80">
      <div className="flex flex-col gap-3 border-b border-white/5 bg-[#0d1424] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow text-[10px] text-accent/80">Private proposal</p>
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-white">
            {title}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-2 flex items-center gap-1 rounded-md border border-white/10 bg-navy/80 p-1">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.75, Math.round((s - 0.1) * 100) / 100))}
              className="rounded px-2 py-1 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="min-w-[3rem] text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(1.5, Math.round((s + 0.1) * 100) / 100))}
              className="rounded px-2 py-1 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary py-2 px-4 text-[10px]"
          >
            Open in tab
          </a>
          <a href={file} download className="btn-cta py-2 px-4 text-[10px]">
            Download
          </a>
        </div>
      </div>
      <div className="max-h-[min(85vh,900px)] overflow-auto bg-navy px-2 py-4 sm:px-4">
        <ProposalPdfDocument file={file} scale={scale} />
      </div>
    </div>
  );
}

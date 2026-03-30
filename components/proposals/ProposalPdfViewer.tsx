"use client";

type Props = {
  /** Public path to proposal PDF in /public */
  file: string;
  title: string;
  /** Optional W-9 or other vendor PDF — shown as additional download */
  w9File?: string;
  w9Label?: string;
};

/**
 * Native PDF embed (iframe). Zoom/search use the browser PDF UI.
 */
export default function ProposalPdfViewer({
  file,
  title,
  w9File,
  w9Label = "W-9 (Abramovich Media LLC)",
}: Props) {
  return (
    <div className="brand-card overflow-hidden border border-white/10 bg-navy-light/80">
      <div className="flex flex-col gap-3 border-b border-white/5 bg-[#0d1424] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow text-[10px] text-accent/80">Private proposal</p>
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-white">
            {title}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary py-2 px-4 text-[10px]"
            >
              Open proposal in tab
            </a>
            <a href={file} download className="btn-cta py-2 px-4 text-[10px]">
              Download proposal
            </a>
            {w9File ? (
              <a
                href={w9File}
                download
                className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-accent/40 hover:bg-white/10"
              >
                Download {w9Label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-[#0a0f18] p-2 sm:p-3">
        <div className="relative h-[min(85vh,900px)] w-full overflow-hidden rounded-lg border border-white/10 bg-navy">
          <iframe
            src={`${file}#toolbar=1&navpanes=0`}
            title={title}
            className="absolute inset-0 h-full w-full bg-navy"
          />
        </div>
        <p className="muted-text mt-3 text-center text-[11px]">
          Use your browser&apos;s PDF controls to zoom and search. Safari and Chrome
          both support inline PDF.
        </p>
      </div>
    </div>
  );
}

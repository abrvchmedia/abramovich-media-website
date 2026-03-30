"use client";

import { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  file: string;
  scale?: number;
};

export default function ProposalPdfDocument({ file, scale = 1 }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState(720);

  useEffect(() => {
    const update = () =>
      setWidth(Math.min(720, Math.max(280, window.innerWidth - 56)));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const onLoadSuccess = useCallback(
    ({ numPages: nextNumPages }: { numPages: number }) => {
      setNumPages(nextNumPages);
    },
    []
  );

  return (
    <Document
      file={file}
      onLoadSuccess={onLoadSuccess}
      loading={
        <div className="py-16 text-center text-sm font-medium text-gray-400">
          Loading proposal…
        </div>
      }
      error={
        <div className="py-16 text-center text-sm font-medium text-red-400/90">
          Unable to load this PDF. Use &quot;Open in new tab&quot; below.
        </div>
      }
      className="flex flex-col items-center"
    >
      {Array.from({ length: numPages }, (_, i) => (
        <div
          key={i + 1}
          className="mb-4 last:mb-0 rounded-lg border border-white/5 bg-[#0d1424] p-2 shadow-lg"
        >
          <Page
            pageNumber={i + 1}
            width={Math.round(width * scale)}
            renderTextLayer
            renderAnnotationLayer
            className="!bg-transparent"
          />
        </div>
      ))}
    </Document>
  );
}

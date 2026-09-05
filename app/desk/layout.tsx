import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desk",
  description:
    "Abramovich Media desk — talent, distribution, financiers, production work, and brand deals.",
  robots: { index: false, follow: false },
};

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="desk-root min-h-screen bg-[#07090d] text-[#d7e0ea] font-desk">
      {children}
    </div>
  );
}

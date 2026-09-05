import { Metadata } from "next";
import DeskAuthCard from "@/components/desk/DeskAuthCard";

export const metadata: Metadata = {
  title: "Desk login",
  robots: { index: false, follow: false },
};

export default function DeskLoginPage() {
  return <DeskAuthCard mode="login" />;
}

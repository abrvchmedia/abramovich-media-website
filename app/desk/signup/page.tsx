import { Metadata } from "next";
import DeskAuthCard from "@/components/desk/DeskAuthCard";

export const metadata: Metadata = {
  title: "Desk sign up",
  robots: { index: false, follow: false },
};

export default function DeskSignupPage() {
  return <DeskAuthCard mode="signup" />;
}

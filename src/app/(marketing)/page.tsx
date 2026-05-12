import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";

export const metadata: Metadata = {
  title: "Chroniva — AI Photo Booth for Unforgettable Events",
  description:
    "Transform any event into a cinematic AI-powered photo booth. Instantly shareable, infinitely magical.",
};

export default function MarketingPage() {
  return <Hero />;
}

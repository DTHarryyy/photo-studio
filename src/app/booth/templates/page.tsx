import type { Metadata } from "next";
import { Booth } from "@/components/booth/Booth";

export const metadata: Metadata = {
  title: "Choose Your Template — Chroniva Photo Booth",
  description:
    "Pick from premium photo booth templates. Minimal, vintage, film, Y2K, wedding, and corporate styles.",
};

export default function BoothTemplatesPage() {
  return <Booth />;
}

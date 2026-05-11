import type { Metadata } from "next";
import { BoothLayoutSelect } from "@/components/booth/BoothLayoutSelect";

export const metadata: Metadata = {
  title: "Choose a Layout — Pitik Photo Booth",
  description: "Pick your photo layout before choosing a template.",
};

export default function BoothPage() {
  return <BoothLayoutSelect />;
}

import type { Metadata } from "next";
import { StudioOrchestrator } from "@/features/studio/components/StudioOrchestrator";

export const metadata: Metadata = {
  title: "Pitik Studio",
  description: "Capture and compose your photo booth strip.",
};

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ layout?: string }>;
}) {
  const { layout } = await searchParams;
  return <StudioOrchestrator layout={layout} />;
}

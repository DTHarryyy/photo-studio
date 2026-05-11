import { type NextRequest, NextResponse } from "next/server";
import { templates } from "@/data/templates";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const category = searchParams.get("category");
  const premium = searchParams.get("premium");
  const q = searchParams.get("q");

  let result = templates;

  if (category && category !== "All") {
    result = result.filter((t) => t.category === category);
  }

  if (premium === "true") {
    result = result.filter((t) => t.isPremium);
  } else if (premium === "false") {
    result = result.filter((t) => !t.isPremium);
  }

  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(lower) ||
        t.tags.some((tag) => tag.toLowerCase().includes(lower))
    );
  }

  return NextResponse.json({ templates: result, total: result.length });
}

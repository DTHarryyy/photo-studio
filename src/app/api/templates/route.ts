import { NextResponse } from "next/server";

export async function GET() {
  // TODO: fetch from DB/CMS; return template registry
  return NextResponse.json({ templates: [] });
}

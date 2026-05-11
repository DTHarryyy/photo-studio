import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  // TODO: composite layers, apply watermark, upload to storage
  return NextResponse.json({ message: "export route placeholder" }, { status: 501 });
}

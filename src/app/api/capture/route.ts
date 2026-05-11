import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  // TODO: process captured frame (resize, compress, store temporarily)
  return NextResponse.json({ message: "capture route placeholder" }, { status: 501 });
}

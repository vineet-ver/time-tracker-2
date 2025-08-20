import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Health DB error:", err);
    return NextResponse.json({ ok: false, error: "DB connection failed" }, { status: 500 });
  }
}



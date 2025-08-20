import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TimeEntry } from "@/models/TimeEntry";
import { verifyAuthToken } from "@/lib/auth";
import { getAuthCookie } from "@/lib/cookies";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const token = await getAuthCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await verifyAuthToken(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const start = req.nextUrl.searchParams.get("start");
  const end = req.nextUrl.searchParams.get("end");
  const filter: Record<string, unknown> = { userId: user.sub };
  if (start || end) {
    const range: Record<string, Date> = {};
    if (start) range.$gte = new Date(start);
    if (end) range.$lte = new Date(end);
    (filter as Record<string, unknown>).startTime = range;
  }
  const entries = await TimeEntry.find(filter).lean();
  const totalMinutes = entries.reduce((sum, e) => {
    const s = new Date(e.startTime).getTime();
    const ee = e.endTime ? new Date(e.endTime).getTime() : Date.now();
    return sum + Math.max(0, Math.round((ee - s) / 60000));
  }, 0);
  return NextResponse.json({ totalMinutes });
}



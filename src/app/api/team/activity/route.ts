import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TimeEntry } from "@/models/TimeEntry";
import { verifyAuthToken } from "@/lib/auth";
import { getAuthCookie } from "@/lib/cookies";

export const runtime = "nodejs";

export async function GET() {
  await connectToDatabase();
  const token = await getAuthCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await verifyAuthToken(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  // A simplistic "who's working": entries with no endTime, or started within last 5 minutes
  const active = await TimeEntry.find({
    $or: [
      { endTime: { $exists: false } },
      { startTime: { $gte: fiveMinutesAgo } },
    ],
  }).sort({ startTime: -1 }).limit(50).lean();
  return NextResponse.json({ active });
}



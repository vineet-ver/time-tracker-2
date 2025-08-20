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

  const taskId = req.nextUrl.searchParams.get("taskId");
  const filter: Record<string, unknown> = { userId: user.sub };
  if (taskId) filter.taskId = taskId;
  const entries = await TimeEntry.find(filter).sort({ startTime: -1 }).lean();
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const token = await getAuthCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await verifyAuthToken(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { taskId, startTime, endTime, durationMinutes, note } = body || {};
  if (!taskId || !startTime) return NextResponse.json({ error: "taskId and startTime required" }, { status: 400 });
  const entry = await TimeEntry.create({ taskId, userId: user.sub, startTime, endTime, durationMinutes, note });
  return NextResponse.json({ entry });
}

export async function PATCH(req: NextRequest) {
  await connectToDatabase();
  const token = await getAuthCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await verifyAuthToken(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, endTime } = body || {};
  if (!id || !endTime) return NextResponse.json({ error: "id and endTime required" }, { status: 400 });
  const entry = await TimeEntry.findOneAndUpdate({ _id: id, userId: user.sub }, { endTime }, { new: true });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ entry });
}



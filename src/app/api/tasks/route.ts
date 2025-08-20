import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Task } from "@/models/Task";
import { verifyAuthToken } from "@/lib/auth";
import { getAuthCookie } from "@/lib/cookies";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const token = await getAuthCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await verifyAuthToken(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projectId = req.nextUrl.searchParams.get("projectId");
  const filter: Record<string, unknown> = {};
  if (projectId) filter.projectId = projectId;
  const tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const token = await getAuthCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await verifyAuthToken(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { projectId, title, description, assignedToId } = body || {};
  if (!projectId || !title) return NextResponse.json({ error: "projectId and title required" }, { status: 400 });
  const task = await Task.create({ projectId, title, description, assignedToId, status: "todo" });
  return NextResponse.json({ task });
}



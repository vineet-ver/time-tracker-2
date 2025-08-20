import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { verifyAuthToken } from "@/lib/auth";
import { getAuthCookie } from "@/lib/cookies";

export const runtime = "nodejs";

export async function GET() {
  await connectToDatabase();
  const token = await getAuthCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await verifyAuthToken(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await Project.find({ $or: [
    { ownerId: user.sub },
    { memberIds: user.sub },
  ]}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const token = await getAuthCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await verifyAuthToken(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, description } = body || {};
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const project = await Project.create({ name, description, ownerId: user.sub, memberIds: [user.sub] });
  return NextResponse.json({ project });
}



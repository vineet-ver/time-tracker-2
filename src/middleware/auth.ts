import { NextRequest, NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/cookies";
import { verifyAuthToken } from "@/lib/auth";

export async function requireAuth(_req: NextRequest) {
  const token = await getAuthCookie();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await verifyAuthToken(token);
    return null;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}



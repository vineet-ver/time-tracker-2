import { NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/cookies";
import { verifyAuthToken } from "@/lib/auth";

export async function GET() {
  const token = await getAuthCookie();
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  try {
    const payload = await verifyAuthToken(token);
    return NextResponse.json({ user: payload }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}



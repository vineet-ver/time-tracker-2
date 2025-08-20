import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { createAuthToken } from "@/lib/auth";
import { setAuthCookie } from "@/lib/cookies";

export const runtime = "nodejs";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = LoginSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const { email, password } = parsed.data;

    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createAuthToken({ sub: String(user._id), email: user.email, name: user.name, role: user.role });
    await setAuthCookie(token);
    return NextResponse.json({ id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error. Check database connection and env vars." }, { status: 500 });
  }
}



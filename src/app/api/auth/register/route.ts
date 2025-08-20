import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { createAuthToken } from "@/lib/auth";
import { setAuthCookie } from "@/lib/cookies";

export const runtime = "nodejs";

const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = RegisterSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const { email, name, password } = parsed.data;

    await connectToDatabase();

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash, role: "user" });

    const token = await createAuthToken({ sub: String(user._id), email, name, role: "user" });
    await setAuthCookie(token);
    return NextResponse.json({ id: user._id, email, name, role: user.role });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error. Check database connection and env vars." }, { status: 500 });
  }
}



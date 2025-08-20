import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST() {
  await connectToDatabase();
  const email = "demo@acme.com";
  const exists = await User.findOne({ email }).lean();
  if (exists) return NextResponse.json({ ok: true });
  const passwordHash = await bcrypt.hash("password", 10);
  await User.create({ email, name: "Demo User", passwordHash, role: "admin" });
  return NextResponse.json({ ok: true });
}



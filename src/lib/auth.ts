import { SignJWT, jwtVerify } from "jose";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET. Add it to .env.local");
  }
  return new TextEncoder().encode(secret);
}

export interface AuthTokenPayload {
  sub: string; // user id
  email: string;
  name: string;
  role: "user" | "admin";
}

export async function createAuthToken(payload: AuthTokenPayload): Promise<string> {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify(token, getSecretKey());
  return payload as unknown as AuthTokenPayload;
}



import { cookies } from "next/headers";

const AUTH_COOKIE = "tt_jwt";

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value;
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}

export { AUTH_COOKIE };



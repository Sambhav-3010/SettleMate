import { Request, Response } from "express";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "auth_token";

export function getAuthCookieName() {
  return AUTH_COOKIE_NAME;
}

export function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    maxAge: 1000 * 60 * 60 * 24 * 30,
    path: "/",
  };
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    ...getCookieOptions(),
    maxAge: 0,
  });
}

export function readAuthCookie(req: Request) {
  return req.cookies?.[AUTH_COOKIE_NAME] as string | undefined;
}

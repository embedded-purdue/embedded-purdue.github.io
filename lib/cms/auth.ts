import crypto from "node:crypto";
import { cookies } from "next/headers";

export const CMS_COOKIE = "esap_cms_session";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function getSecret() {
  const secret = process.env.CMS_SESSION_SECRET || process.env.CMS_PASSWORD;
  if (!secret) throw new Error("CMS_PASSWORD or CMS_SESSION_SECRET is not configured.");
  return secret;
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function verifyCmsPassword(password: string) {
  const expected = process.env.CMS_PASSWORD;
  if (!expected) throw new Error("CMS_PASSWORD is not configured.");
  const left = Buffer.from(password);
  const right = Buffer.from(expected);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function createCmsSession() {
  const issuedAt = String(Date.now());
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function verifyCmsSession(value?: string) {
  if (!value) return false;
  const [issuedAt, signature] = value.split(".");
  if (!issuedAt || !signature || sign(issuedAt) !== signature) return false;
  const issuedAtMs = Number(issuedAt);
  return Number.isFinite(issuedAtMs) && Date.now() - issuedAtMs <= MAX_AGE_SECONDS * 1000;
}

export async function isCmsAuthed() {
  const cookieStore = await cookies();
  return verifyCmsSession(cookieStore.get(CMS_COOKIE)?.value);
}

export async function requireCmsAuth() {
  if (await isCmsAuthed()) return null;
  return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
}

export const cmsCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};

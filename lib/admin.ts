// lib/admin.ts
export function requireAdmin(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return token && token === process.env.ADMIN_TOKEN;
}

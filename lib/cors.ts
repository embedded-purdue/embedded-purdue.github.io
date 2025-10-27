// lib/cors.ts
export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = process.env.ALLOWED_ORIGIN ?? "";
  const ok = !!origin && (allowed === "*" || origin === allowed);
  return {
    "Access-Control-Allow-Origin": ok ? origin! : allowed === "*" ? "*" : "",
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function handleOptions(origin: string | null) {
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

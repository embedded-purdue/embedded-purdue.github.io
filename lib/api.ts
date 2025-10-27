// lib/api.ts
export const EXTERNAL_API = process.env.VERCEL_API_BASE!; // e.g. https://your-external-project.vercel.app/api

export async function proxyJson(path: string, init?: RequestInit) {
  const res = await fetch(`${EXTERNAL_API}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`External API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function proxyForm(path: string, form: FormData, init?: RequestInit) {
  const res = await fetch(`${EXTERNAL_API}${path}`, {
    method: "POST",
    body: form,
    cache: "no-store",
    ...(init || {}),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`External API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

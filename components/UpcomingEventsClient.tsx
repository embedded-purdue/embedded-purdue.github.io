"use client";

import { useEffect, useState } from "react";

type CalEvent = {
  id: string;
  summary?: string;
  htmlLink?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
};

const CAL_ID = "embedded@purdue.edu"; // or your group calendar ID
const KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // must be defined
const TZ = "America/Indiana/Indianapolis";

function fmt(dt?: string) {
  if (!dt) return "TBA";
  const d = new Date(dt);
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(d);
}

export default function UpcomingEventsClient({ limit = 6 }: { limit?: number }) {
  const [items, setItems] = useState<CalEvent[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!KEY) {
      setErr("Missing NEXT_PUBLIC_GOOGLE_API_KEY");
      console.error("Set NEXT_PUBLIC_GOOGLE_API_KEY in .env.local");
      return;
    }
    const timeMin = new Date().toISOString();
    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CAL_ID)}/events` +
      `?key=${encodeURIComponent(KEY)}` +
      `&singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(timeMin)}` +
      `&maxResults=${limit}&timeZone=${encodeURIComponent(TZ)}`;

    fetch(url)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          console.error("Calendar API error", r.status, data);
          throw new Error(data.error?.message || `HTTP ${r.status}`);
        }
        return data;
      })
      .then((data) => setItems(data.items ?? []))
      .catch((e) => setErr(String(e)));
  }, [limit]);

  if (err) return <div className="mt-6 text-sm text-destructive">Couldn’t load events: {err}</div>;
  if (!items) return <div className="mt-6 text-sm text-muted-foreground">Loading upcoming events…</div>;
  if (!items.length) return <div className="mt-6 text-sm text-muted-foreground">No upcoming events yet.</div>;

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {items.map((e) => {
        const start = e.start?.dateTime || e.start?.date;
        return (
          <a key={e.id} href={e.htmlLink} target="_blank" rel="noopener noreferrer" className="no-underline">
            <div className="rounded-lg border p-4 hover:shadow-sm transition">
              <div className="text-sm text-muted-foreground">{fmt(start)}</div>
              <div className="mt-1 font-medium">{e.summary || "Untitled event"}</div>
              {e.location && <div className="text-sm text-muted-foreground">{e.location}</div>}
            </div>
          </a>
        );
      })}
    </div>
  );
}
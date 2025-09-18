// app/admin/events/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const API_URL = "https://esap-events-api.vercel.app/api/events";

// helper: local "YYYY-MM-DDTHH:mm" -> UTC ISO "YYYY-MM-DDTHH:mm:ssZ"
function toUtcISOString(localValue: string) {
  const d = new Date(localValue);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

type Freq = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
const WEEKDAYS = [
  { label: "Mon", value: "MO" },
  { label: "Tue", value: "TU" },
  { label: "Wed", value: "WE" },
  { label: "Thu", value: "TH" },
  { label: "Fri", value: "FR" },
  { label: "Sat", value: "SA" },
  { label: "Sun", value: "SU" },
];

// Build an RFC5545 RRULE from simple form fields
function buildRRule(opts: {
  freq: Freq;
  interval?: number;
  byWeekDays?: string[];
  byMonthDay?: number;
  count?: number;
  until?: string | null; // local "YYYY-MM-DD"
}) {
  if (opts.freq === "NONE") return null;

  const parts = [`FREQ=${opts.freq}`];

  if (opts.interval && opts.interval > 1) parts.push(`INTERVAL=${opts.interval}`);

  if (opts.freq === "WEEKLY" && opts.byWeekDays && opts.byWeekDays.length) {
    parts.push(`BYDAY=${opts.byWeekDays.join(",")}`);
  }

  if ((opts.freq === "MONTHLY" || opts.freq === "YEARLY") && opts.byMonthDay) {
    parts.push(`BYMONTHDAY=${opts.byMonthDay}`);
  }

  if (opts.count && opts.count > 0) {
    parts.push(`COUNT=${opts.count}`);
  } else if (opts.until) {
    // UNTIL must be in UTC in basic format YYYYMMDDT235959Z (use end-of-day)
    const until = new Date(`${opts.until}T23:59:59`);
    const y = until.getUTCFullYear();
    const m = String(until.getUTCMonth() + 1).padStart(2, "0");
    const d = String(until.getUTCDate()).padStart(2, "0");
    parts.push(`UNTIL=${y}${m}${d}T235959Z`);
  }

  return `RRULE:${parts.join(";")}`;
}

export default function AdminEventsPage() {
  const [msg, setMsg] = useState<string | null>(null);

  const [freq, setFreq] = useState<Freq>("NONE");
  const [interval, setInterval] = useState<number>(1);
  const [byDays, setByDays] = useState<string[]>([]);
  const [byMonthDay, setByMonthDay] = useState<number | undefined>(undefined);
  const [endMode, setEndMode] = useState<"NEVER" | "COUNT" | "UNTIL">("NEVER");
  const [count, setCount] = useState<number | undefined>(undefined);
  const [until, setUntil] = useState<string | undefined>(undefined);
  const [exDates, setExDates] = useState<string>(""); // comma-separated YYYY-MM-DD

  const rrule = useMemo(
    () =>
      buildRRule({
        freq,
        interval,
        byWeekDays: freq === "WEEKLY" ? byDays : undefined,
        byMonthDay: freq === "MONTHLY" || freq === "YEARLY" ? byMonthDay : undefined,
        count: endMode === "COUNT" ? count : undefined,
        until: endMode === "UNTIL" ? until ?? null : null,
      }),
    [freq, interval, byDays, byMonthDay, endMode, count, until],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;

    const startLocal = (f.elements.namedItem("start") as HTMLInputElement).value;
    const endLocal = (f.elements.namedItem("end") as HTMLInputElement).value;

    const startUtc = toUtcISOString(startLocal);
    const endUtc = toUtcISOString(endLocal);

    if (!startUtc || !endUtc) {
      setMsg("❌ Invalid date/time");
      return;
    }

    const body: any = {
      title: (f.elements.namedItem("title") as HTMLInputElement).value,
      start: startUtc,
      end: endUtc,
      location: (f.elements.namedItem("location") as HTMLInputElement).value,
      desc: (f.elements.namedItem("desc") as HTMLTextAreaElement).value,
    };

    if (rrule) body.recurrence = rrule;

    const exdates = exDates
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    if (exdates.length) body.exDates = exdates; // array of YYYY-MM-DD

    const r = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setMsg(r.ok ? "✅ Event created!" : `❌ ${await r.text()}`);
    if (r.ok) {
      f.reset();
      setFreq("NONE");
      setInterval(1);
      setByDays([]);
      setByMonthDay(undefined);
      setEndMode("NEVER");
      setCount(undefined);
      setUntil(undefined);
      setExDates("");
    }
  }

  const isRecurring = freq !== "NONE";

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Navigation />
      <div className="h-12" />

      <h1 className="mt-6 mb-4 text-2xl font-semibold">Add New Event</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input name="title" placeholder="Event Title" required className="rounded border p-2" />
        <input name="start" type="datetime-local" step="900" required className="rounded border p-2" />
        <input name="end" type="datetime-local" step="900" required className="rounded border p-2" />
        <input name="location" placeholder="Location" className="rounded border p-2" />
        <textarea name="desc" placeholder="Description" className="rounded border p-2" />

        <div className="mt-4 rounded border p-3">
          <div className="mb-2 font-medium">Recurrence</div>
          <div className="grid gap-2">
            <select
              value={freq}
              onChange={e => setFreq(e.target.value as Freq)}
              className="rounded border p-2"
            >
              <option value="NONE">Does not repeat</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>

            {isRecurring && (
              <>
                <label className="flex items-center gap-2">
                  <span className="w-24">Interval</span>
                  <input
                    type="number"
                    min={1}
                    value={interval}
                    onChange={e => setInterval(parseInt(e.target.value || "1", 10))}
                    className="w-24 rounded border p-2"
                  />
                </label>

                {freq === "WEEKLY" && (
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map(d => (
                      <label key={d.value} className="flex items-center gap-1 border rounded px-2 py-1">
                        <input
                          type="checkbox"
                          checked={byDays.includes(d.value)}
                          onChange={e =>
                            setByDays(prev =>
                              e.target.checked ? [...prev, d.value] : prev.filter(x => x !== d.value),
                            )
                          }
                        />
                        {d.label}
                      </label>
                    ))}
                  </div>
                )}

                {(freq === "MONTHLY" || freq === "YEARLY") && (
                  <label className="flex items-center gap-2">
                    <span className="w-24">Day of month</span>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={byMonthDay ?? ""}
                      onChange={e => setByMonthDay(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                      className="w-24 rounded border p-2"
                    />
                  </label>
                )}

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={endMode === "NEVER"}
                      onChange={() => setEndMode("NEVER")}
                    />
                    Never ends
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={endMode === "COUNT"}
                      onChange={() => setEndMode("COUNT")}
                    />
                    After
                    <input
                      type="number"
                      min={1}
                      disabled={endMode !== "COUNT"}
                      value={count ?? ""}
                      onChange={e => setCount(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                      className="w-20 rounded border p-1"
                    />
                    occurrences
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={endMode === "UNTIL"}
                      onChange={() => setEndMode("UNTIL")}
                    />
                    Until
                    <input
                      type="date"
                      disabled={endMode !== "UNTIL"}
                      value={until ?? ""}
                      onChange={e => setUntil(e.target.value || undefined)}
                      className="rounded border p-1"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    Skip dates (comma-separated YYYY-MM-DD)
                  </span>
                  <input
                    placeholder="2025-10-14, 2025-11-11"
                    value={exDates}
                    onChange={e => setExDates(e.target.value)}
                    className="rounded border p-2"
                  />
                </label>

                {rrule && (
                  <div className="rounded bg-muted p-2 text-xs">
                    RRULE preview: <code>{rrule}</code>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Button type="submit">Create event</Button>
      </form>

      {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
      <Footer />
    </div>
  );
}
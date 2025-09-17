// app/admin/events/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const API_URL = "https://esap-events-api.vercel.app/api/events";

// helper: local "YYYY-MM-DDTHH:mm" -> UTC ISO "YYYY-MM-DDTHH:mm:ssZ"
function toUtcISOString(localValue: string) {
  // new Date("2025-09-16T18:00") is interpreted as LOCAL time
  const d = new Date(localValue);
  if (isNaN(d.getTime())) return null;
  return d.toISOString(); // e.g. "2025-09-16T22:00:00.000Z" for EDT
}

export default function AdminEventsPage() {
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;

    const startLocal = (f.elements.namedItem("start") as HTMLInputElement).value;
    const endLocal   = (f.elements.namedItem("end")   as HTMLInputElement).value;

    const startUtc = toUtcISOString(startLocal);
    const endUtc   = toUtcISOString(endLocal);

    if (!startUtc || !endUtc) {
      setMsg("❌ Invalid date/time");
      return;
    }

    const body = {
      title: (f.elements.namedItem("title") as HTMLInputElement).value,
      start: startUtc, // <-- send UTC
      end:   endUtc,   // <-- send UTC
      location: (f.elements.namedItem("location") as HTMLInputElement).value,
      desc: (f.elements.namedItem("desc") as HTMLTextAreaElement).value,
    };

    const r = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setMsg(r.ok ? "✅ Event created!" : `❌ ${await r.text()}`);
    if (r.ok) f.reset();
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Navigation />
      <div className="h-12" />

      <h1 className="mt-6 mb-4 text-2xl font-semibold">Add New Event</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input name="title" placeholder="Event Title" required className="rounded border p-2" />
        {/* step optional, just for nicer minute selection */}
        <input name="start" type="datetime-local" step="900" required className="rounded border p-2" />
        <input name="end" type="datetime-local" step="900" required className="rounded border p-2" />
        <input name="location" placeholder="Location" className="rounded border p-2" />
        <textarea name="desc" placeholder="Description" className="rounded border p-2" />
        <Button type="submit">Create event</Button>
      </form>

      {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
      <Footer />
    </div>
  );
}
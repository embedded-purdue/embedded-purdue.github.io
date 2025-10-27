// app/api/page.tsx
"use client";

import { useEffect, useState } from "react";

// Prefer NEXT_PUBLIC_API_BASE; in local dev on port 3000, fall back to FastAPI at 127.0.0.1:8000.
const DEFAULT_API_BASE: string =
  (process.env.NEXT_PUBLIC_API_BASE as string) ||
  ((typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && window.location.port === "3000")
    ? "http://127.0.0.1:8000"
    : ""); // "" = same-origin (works in production if proxied)

type CreateEventPayload = {
  title: string;
  startISO: string;
  endISO: string;
  url?: string;
  description?: string;
  location?: string;
};

export default function AdminPage() {
  // --- Auth & routing state ---
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("stm32fan");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string>("");
  const [view, setView] = useState<"login" | "hub" | "events" | "media">("login");
  const [apiBase, setApiBase] = useState<string>(DEFAULT_API_BASE);

  useEffect(() => {
    const saved = sessionStorage.getItem("ADMIN_TOKEN") || "";
    const savedUser = sessionStorage.getItem("ADMIN_USER") || "";
    const savedApi = sessionStorage.getItem("ADMIN_API_BASE") || "";
    if (saved) {
      setToken(saved);
    }
    if (savedUser) {
      setUsername(savedUser);
    }
    if (savedApi) {
      setApiBase(savedApi);
    }
    if (saved && savedUser === "stm32fan") {
      setView("hub");
    }
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("ADMIN_TOKEN");
    sessionStorage.removeItem("ADMIN_USER");
    setToken("");
    setLoginPassword("");
    setUsername("stm32fan");
    setView("login");
  }

  function persistToken(v: string) {
    setToken(v);
    sessionStorage.setItem("ADMIN_TOKEN", v);
  }

  function persistApiBase(v: string) {
    setApiBase(v);
    sessionStorage.setItem("ADMIN_API_BASE", v);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    // Very light-weight check: require the specific username and a non-empty password (token)
    if (username.trim() !== "stm32fan") {
      setLoginError("Invalid username.");
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError("Please enter your admin token as the password.");
      return;
    }
    // Persist selections and continue to hub. Real auth enforced on API calls.
    sessionStorage.setItem("ADMIN_TOKEN", loginPassword.trim());
    sessionStorage.setItem("ADMIN_USER", username.trim());
    persistApiBase((apiBase || "").trim());
    setToken(loginPassword.trim());
    setView("hub");
  }

  // --- Event form state ---
  const [evt, setEvt] = useState<CreateEventPayload>({
    title: "",
    startISO: "",
    endISO: "",
    url: "",
    description: "",
    location: "",
  });
  const [evtStatus, setEvtStatus] = useState<string>("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [attendeesTxt, setAttendeesTxt] = useState("");
  const [useDefaultReminders, setUseDefaultReminders] = useState(true);
  const [emailReminderMinutes, setEmailReminderMinutes] = useState<string>("");
  const [recMode, setRecMode] = useState<"none" | "builder" | "raw">("none");
  const [rrule, setRrule] = useState("");
  const [freq, setFreq] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "">("");
  const [interval, setInterval] = useState<string>("");
  const [byDay, setByDay] = useState<string[]>([]);
  const [byMonthDayTxt, setByMonthDayTxt] = useState<string>("");
  const [count, setCount] = useState<string>("");
  const [until, setUntil] = useState<string>("");

  // --- Media form state ---
  const [kind, setKind] = useState<"project" | "workshop" | "other">("project");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [mediaStatus, setMediaStatus] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"blob" | "github">("blob");
  const [projectSlug, setProjectSlug] = useState("");
  const [prUrl, setPrUrl] = useState<string>("");

  // Ensure RFC3339 date-time with seconds and offset when no timeZone is provided
  function toRfc3339WithOffset(input: string): string {
    if (!input) return input;
    // If already contains 'Z' or an offset, just ensure seconds
    const hasZone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(input);
    const hasSeconds = /T\d{2}:\d{2}:\d{2}/.test(input);
    let base = input;
    if (!hasSeconds) base = `${input}:00`;
    if (hasZone) return base;
    // Compute local offset for the given local date-time
    const d = new Date(base);
    const offMin = -d.getTimezoneOffset(); // minutes east of UTC
    const sign = offMin >= 0 ? "+" : "-";
    const abs = Math.abs(offMin);
    const hh = String(Math.floor(abs / 60)).padStart(2, "0");
    const mm = String(abs % 60).padStart(2, "0");
    return `${base}${sign}${hh}:${mm}`;
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setEvtStatus("Saving...");
    try {
      const payload: any = {
        title: evt.title,
        description: evt.description,
        location: evt.location,
        url: evt.url,
      };

      if (isAllDay) {
        payload.startDate = startDate;
        payload.endDate = endDate || startDate;
      } else {
        // For timed events, if no timeZone provided, include timezone offset in the dateTime strings
        if (timeZone.trim()) {
          payload.startISO = evt.startISO ? (evt.startISO.includes(":") && evt.startISO.length === 16 ? `${evt.startISO}:00` : evt.startISO) : "";
          payload.endISO = evt.endISO ? (evt.endISO.includes(":") && evt.endISO.length === 16 ? `${evt.endISO}:00` : evt.endISO) : "";
          payload.timeZone = timeZone.trim();
        } else {
          payload.startISO = toRfc3339WithOffset(evt.startISO);
          payload.endISO = toRfc3339WithOffset(evt.endISO);
        }
      }

      if (attendeesTxt.trim()) {
        const emails = attendeesTxt
          .split(/[\n,\s]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        if (emails.length) payload.attendees = emails.map((email) => ({ email }));
      }

      if (useDefaultReminders) {
        payload.reminders = { useDefault: true };
      } else if (emailReminderMinutes.trim()) {
        const mins = Math.max(0, Number(emailReminderMinutes));
        payload.reminders = { useDefault: false, overrides: [{ method: "email", minutes: mins }] };
      }

      if (recMode === "raw" && rrule.trim()) {
        payload.rrule = rrule.trim();
      } else if (recMode === "builder") {
        const rep: any = {};
        if (freq) rep.freq = freq;
        if (interval) rep.interval = Number(interval);
        if (byDay.length) rep.byDay = byDay;
        if (byMonthDayTxt.trim()) {
          const nums = byMonthDayTxt
            .split(/[\s,]+/)
            .map((x) => x.trim())
            .filter(Boolean)
            .map((x) => Number(x))
            .filter((n) => Number.isFinite(n));
          if (nums.length) rep.byMonthDay = nums;
        }
        if (count) rep.count = Number(count);
        if (until.trim()) rep.until = until.trim();
        if (Object.keys(rep).length) payload.repeat = rep;
      }

  const base = apiBase || "";
  const res = await fetch(`${base}/api/events`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || res.statusText);
      setEvtStatus("Event created ✅");
  setEvt({ title: "", startISO: "", endISO: "", url: "", description: "", location: "" });
  setIsAllDay(false);
  setStartDate("");
  setEndDate("");
  setTimeZone("");
  setAttendeesTxt("");
  setUseDefaultReminders(true);
  setEmailReminderMinutes("");
  setRecMode("none");
  setRrule("");
  setFreq("");
  setInterval("");
  setByDay([]);
  setByMonthDayTxt("");
  setCount("");
  setUntil("");
    } catch (err: any) {
      setEvtStatus(`Error: ${err.message || String(err)}`);
    }
  }

  async function handleUploadMedia(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) {
      setMediaStatus("Please choose at least one file.");
      return;
    }
    setMediaStatus("Uploading...");
    try {
      setPrUrl("");
      if (uploadMode === "github") {
        if (!projectSlug.trim()) {
          setMediaStatus("Please provide a project slug for the GitHub upload.");
          return;
        }
        const form = new FormData();
        form.set("projectSlug", projectSlug.trim());
        form.set("title", title);
        if (desc) form.set("description", desc);
        Array.from(files).forEach((f) => form.append("files", f));

  const base = apiBase || "";
  const res = await fetch(`${base}/api/media/upload-gh`, {
          method: "POST",
          headers: token ? { authorization: `Bearer ${token}` } : {},
          body: form,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || res.statusText);
        setMediaStatus("PR opened ✅");
        if (json?.pullRequestUrl) setPrUrl(json.pullRequestUrl);
        setTitle("");
        setDesc("");
        (document.getElementById("media-files") as HTMLInputElement).value = "";
        setFiles(null);
      } else {
        const form = new FormData();
        form.set("kind", kind);
        form.set("title", title);
        if (desc) form.set("description", desc);
        Array.from(files).forEach((f) => form.append("files", f));

  const base = apiBase || "";
  const res = await fetch(`${base}/api/media/upload`, {
          method: "POST",
          headers: token ? { authorization: `Bearer ${token}` } : {},
          body: form,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || res.statusText);
        setMediaStatus("Upload complete ✅");
        setTitle("");
        setDesc("");
        (document.getElementById("media-files") as HTMLInputElement).value = "";
        setFiles(null);
      }
    } catch (err: any) {
      setMediaStatus(`Error: ${err.message || String(err)}`);
    }
  }

  // --- Views ---
  if (view === "login") {
    return (
      <main className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center gap-6 px-4 py-12">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Member Portal</p>
          <h1 className="text-3xl font-bold">Sign in</h1>
          <p className="text-sm text-muted-foreground">Use username and your admin token as the password.</p>
        </div>
        <form onSubmit={handleLogin} className="grid gap-3 rounded-xl border border-border bg-card p-6 shadow-sm">
          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">Username</span>
            <input
              className="rounded-md border border-border bg-background p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="stm32fan"
              required
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">API Base URL</span>
            <input
              className="rounded-md border border-border bg-background p-2"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              placeholder="https://embedded-purdue-api.vercel.app"
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <button type="button" onClick={() => persistApiBase("https://embedded-purdue-api.vercel.app")} className="underline">Use Vercel API</button>
              <span>• If empty, the site will call same-origin (not valid on GitHub Pages).</span>
            </div>
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">Password (Admin Token)</span>
            <input
              type="password"
              className="rounded-md border border-border bg-background p-2"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Paste ADMIN_TOKEN"
              required
            />
          </label>
          <button className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground">Sign in</button>
          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
          {apiBase && (
            <p className="text-xs text-muted-foreground">Using API: <code>{apiBase}</code></p>
          )}
        </form>
      </main>
    );
  }

  if (view === "hub") {
    return (
      <main className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col gap-8 px-4 py-12">
        <header className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Member Portal</p>
            <h1 className="text-3xl font-bold">Admin Hub</h1>
            <p className="text-sm text-muted-foreground">Welcome, {username}.</p>
            {apiBase && (
              <p className="text-xs text-muted-foreground">Using API: <code>{apiBase}</code></p>
            )}
          </div>
          <button onClick={handleLogout} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">Log out</button>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">Manage Events</h2>
            <p className="mb-4 text-sm text-muted-foreground">Create and update upcoming events.</p>
            <button onClick={() => setView("events")} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Open Events</button>
          </article>
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">Manage Media</h2>
            <p className="mb-4 text-sm text-muted-foreground">Upload files to storage or open a GitHub PR.</p>
            <button onClick={() => setView("media")} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Open Media</button>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col gap-8 px-4 py-12">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Member Portal</p>
          <h1 className="text-3xl font-bold">{view === "events" ? "Events" : "Media"} Admin</h1>
          {apiBase && (
            <p className="text-xs text-muted-foreground">Using API: <code>{apiBase}</code></p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("hub")} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">Back to Hub</button>
          <button onClick={handleLogout} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">Log out</button>
        </div>
      </header>

      {view === "events" && (
      <section className="grid gap-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Create Event</h2>
        <form className="grid gap-5" onSubmit={handleCreateEvent}>
          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">Title</span>
            <input
              className="rounded-md border border-border bg-background p-2"
              value={evt.title}
              onChange={(e) => setEvt((s) => ({ ...s, title: e.target.value }))}
              required
            />
          </label>

          <div className="flex items-center gap-2">
            <input id="all-day" type="checkbox" className="h-4 w-4" checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} />
            <label htmlFor="all-day" className="text-sm text-muted-foreground">All-day event</label>
          </div>

          {!isAllDay ? (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Start (date & time)</span>
                <input
                  type="datetime-local"
                  className="rounded-md border border-border bg-background p-2"
                  value={evt.startISO}
                  onChange={(e) => setEvt((s) => ({ ...s, startISO: e.target.value }))}
                  required
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">End (date & time)</span>
                <input
                  type="datetime-local"
                  className="rounded-md border border-border bg-background p-2"
                  value={evt.endISO}
                  onChange={(e) => setEvt((s) => ({ ...s, endISO: e.target.value }))}
                  required
                />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm text-muted-foreground">Time Zone (optional)</span>
                <input
                  className="rounded-md border border-border bg-background p-2"
                  placeholder="e.g., America/Indiana/Indianapolis"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                />
              </label>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Start date</span>
                <input
                  type="date"
                  className="rounded-md border border-border bg-background p-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">End date</span>
                <input
                  type="date"
                  className="rounded-md border border-border bg-background p-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
            </div>
          )}

          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">Location (optional)</span>
            <input
              className="rounded-md border border-border bg-background p-2"
              value={evt.location || ""}
              onChange={(e) => setEvt((s) => ({ ...s, location: e.target.value }))}
              placeholder="e.g., WALC 1018"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">Description</span>
            <textarea
              className="min-h-[100px] rounded-md border border-border bg-background p-2"
              value={evt.description || ""}
              onChange={(e) => setEvt((s) => ({ ...s, description: e.target.value }))}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">More info URL (optional)</span>
            <input
              className="rounded-md border border-border bg-background p-2"
              value={evt.url || ""}
              onChange={(e) => setEvt((s) => ({ ...s, url: e.target.value }))}
              placeholder="https://..."
            />
          </label>

          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">Recurrence:</span>
              <label className="flex items-center gap-1 text-sm"><input type="radio" name="rec" checked={recMode === "none"} onChange={() => setRecMode("none")} /> None</label>
              <label className="flex items-center gap-1 text-sm"><input type="radio" name="rec" checked={recMode === "builder"} onChange={() => setRecMode("builder")} /> Builder</label>
              <label className="flex items-center gap-1 text-sm"><input type="radio" name="rec" checked={recMode === "raw"} onChange={() => setRecMode("raw")} /> Raw RRULE</label>
            </div>

            {recMode === "raw" && (
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">RRULE</span>
                <input
                  className="rounded-md border border-border bg-background p-2"
                  value={rrule}
                  onChange={(e) => setRrule(e.target.value)}
                  placeholder="RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE"
                />
              </label>
            )}

            {recMode === "builder" && (
              <div className="grid gap-3">
                <div className="grid gap-3 md:grid-cols-3">
                  <label className="grid gap-1">
                    <span className="text-sm text-muted-foreground">Frequency</span>
                    <select className="rounded-md border border-border bg-background p-2" value={freq} onChange={(e) => setFreq(e.target.value as any)}>
                      <option value="">None</option>
                      <option value="DAILY">DAILY</option>
                      <option value="WEEKLY">WEEKLY</option>
                      <option value="MONTHLY">MONTHLY</option>
                      <option value="YEARLY">YEARLY</option>
                    </select>
                  </label>
                  <label className="grid gap-1">
                    <span className="text-sm text-muted-foreground">Interval</span>
                    <input className="rounded-md border border-border bg-background p-2" type="number" min={1} value={interval} onChange={(e) => setInterval(e.target.value)} placeholder="1" />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-sm text-muted-foreground">Count (occurrences)</span>
                    <input className="rounded-md border border-border bg-background p-2" type="number" min={1} value={count} onChange={(e) => setCount(e.target.value)} placeholder="e.g., 6" />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="grid gap-2">
                    <span className="text-sm text-muted-foreground">By day</span>
                    <div className="grid grid-cols-7 gap-2 text-sm">
                      {(["MO","TU","WE","TH","FR","SA","SU"] as const).map((d) => (
                        <label key={d} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={byDay.includes(d)}
                            onChange={(e) => {
                              if (e.target.checked) setByDay((s) => [...new Set([...s, d])]);
                              else setByDay((s) => s.filter((x) => x !== d));
                            }}
                          />
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="grid gap-1">
                    <span className="text-sm text-muted-foreground">By month day</span>
                    <input className="rounded-md border border-border bg-background p-2" value={byMonthDayTxt} onChange={(e) => setByMonthDayTxt(e.target.value)} placeholder="e.g., 1,15" />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-sm text-muted-foreground">Until (date)</span>
                    <input type="date" className="rounded-md border border-border bg-background p-2" value={until} onChange={(e) => setUntil(e.target.value)} />
                  </label>
                </div>
              </div>
            )}
          </div>

          <button className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground">
            Create Event
          </button>
          {evtStatus && <p className="text-sm text-muted-foreground">{evtStatus}</p>}
        </form>
      </section>
      )}

      {view === "media" && (
      <section className="grid gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Upload Media</h2>
        <form className="grid gap-3" onSubmit={handleUploadMedia}>
          {/* Upload destination toggle */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">Destination</span>
              <select
                className="rounded-md border border-border bg-background p-2"
                value={uploadMode}
                onChange={(e) => setUploadMode(e.target.value as any)}
              >
                <option value="blob">Vercel Blob (API storage)</option>
                <option value="github">GitHub PR (commit to repo)</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {uploadMode === "blob" ? (
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Kind</span>
                <select
                  className="rounded-md border border-border bg-background p-2"
                  value={kind}
                  onChange={(e) => setKind(e.target.value as any)}
                >
                  <option value="project">Project</option>
                  <option value="workshop">Workshop</option>
                  <option value="other">Other</option>
                </select>
              </label>
            ) : (
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Project Slug</span>
                <input
                  className="rounded-md border border-border bg-background p-2"
                  value={projectSlug}
                  onChange={(e) => setProjectSlug(e.target.value)}
                  placeholder="e.g., smart-watch"
                  required
                />
                <span className="text-xs text-muted-foreground">Files will be committed under public/projects/&lt;slug&gt;/</span>
              </label>
            )}
            <label className="grid gap-1 md:col-span-2">
              <span className="text-sm text-muted-foreground">Title</span>
              <input
                className="rounded-md border border-border bg-background p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">Description (optional)</span>
            <textarea
              className="min-h-[100px] rounded-md border border-border bg-background p-2"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">
              Files {uploadMode === "blob" ? (
                <>
                  (images and/or <code>.md</code>)
                </>
              ) : (
                <>
                  (images, videos, PDFs, markdown, code, CSV, HTML)
                </>
              )}
            </span>
            <input
              id="media-files"
              type="file"
              accept={
                uploadMode === "blob"
                  ? "image/*,.md,text/markdown"
                  : [
                      "image/*",
                      "video/mp4",
                      "video/webm",
                      "application/pdf",
                      "text/markdown,.md,.mdx,.markdown",
                      "text/csv,.csv",
                      "application/json,.json",
                      "text/plain,.txt,.log",
                      "text/html,.html,.htm",
                      "text/css,.css,.scss",
                      ".ts,.tsx,.js,.jsx,.py,.c,.cpp,.hpp,.h,.ino,.rs,.go,.java,.kt,.swift,.sh,.bash,.zsh",
                      ".yaml,.yml,.toml",
                    ].join(",")
              }
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="rounded-md border border-border bg-background p-2"
            />
          </label>

          <button className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground">
            Upload
          </button>
          {mediaStatus && <p className="text-sm text-muted-foreground">{mediaStatus}</p>}
          {prUrl && (
            <p className="text-sm">
              <a className="text-primary underline" href={prUrl} target="_blank" rel="noreferrer">
                View Pull Request
              </a>
            </p>
          )}
        </form>
      </section>
      )}
    </main>
  );
}

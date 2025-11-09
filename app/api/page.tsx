// app/api/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { projects } from "../projects/_data";

// Prefer NEXT_PUBLIC_API_BASE from env. Avoid window checks at module scope to prevent hydration mismatches.
const DEFAULT_API_BASE: string = (process.env.NEXT_PUBLIC_API_BASE as string) || ""; // "" = same-origin (works if proxied)

type CreateEventPayload = {
  title: string;
  startISO: string;
  endISO: string;
  url?: string;
  description?: string;
  location?: string;
};

export default function AdminPage() {
  const DEFAULT_TIME_ZONE = "America/Indiana/Indianapolis";
  // --- Auth & routing state ---
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("stm32fan");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string>("");
  const [view, setView] = useState<"login" | "hub" | "events" | "media">("login");
  const [apiBase, setApiBase] = useState<string>(DEFAULT_API_BASE);
  const [apiOk, setApiOk] = useState<null | boolean>(null);
  const [authOk, setAuthOk] = useState<null | boolean>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("ADMIN_TOKEN") || "";
    const savedUser = sessionStorage.getItem("ADMIN_USER") || "";
    const savedApi = sessionStorage.getItem("ADMIN_API_BASE") || "";
    const savedKind = sessionStorage.getItem("ADMIN_UPLOAD_KIND") as any;
    const savedProj = sessionStorage.getItem("ADMIN_PROJECT_SLUG") || "";
    const savedWork = sessionStorage.getItem("ADMIN_WORKSHOP_SLUG") || "";
    if (saved) {
      setToken(saved);
    }
    if (savedUser) {
      setUsername(savedUser);
    }
    if (savedApi) {
      setApiBase(savedApi);
    } else {
      // Client-only: if running Next dev on :3000, default API to local FastAPI
      if (typeof window !== "undefined") {
        const isLocalDev = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && window.location.port === "3000";
        if (isLocalDev) setApiBase("http://127.0.0.1:8000");
      }
    }
    if (saved && savedUser === "stm32fan") {
      setView("hub");
    }
    if (savedKind === "project" || savedKind === "workshop") setUploadKind(savedKind);
    if (savedProj) setProjectSlug(savedProj);
    if (savedWork) setWorkshopSlug(savedWork);
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
    setApiOk(null);
    setAuthOk(null);
  }

  // Persist quick selections for convenience (hooks defined after state vars below)

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

  async function testConnection() {
    try {
      setChecking(true);
      setApiOk(null);
      setAuthOk(null);
      const base = apiBase || "";
      // Health
      const hr = await fetch(`${base}/api/health`, { cache: "no-store" });
      setApiOk(hr.ok);
      // Auth check (if we have a token)
      if (token) {
        const ar = await fetch(`${base}/api/admin/check`, { headers: { authorization: `Bearer ${token}` } });
        setAuthOk(ar.ok);
      } else {
        setAuthOk(false);
      }
    } catch {
      setApiOk(false);
      setAuthOk(false);
    } finally {
      setChecking(false);
    }
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
  const [evtBusy, setEvtBusy] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Time zone is fixed to Indianapolis; no user input
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
  const [mediaBusy, setMediaBusy] = useState(false);
  const [uploadKind, setUploadKind] = useState<"project" | "workshop">("project");
  const [projectSlug, setProjectSlug] = useState("");
  const [workshopSlug, setWorkshopSlug] = useState("");
  const [prUrl, setPrUrl] = useState<string>("");
  const [initOpen, setInitOpen] = useState(false);
  const [initSlug, setInitSlug] = useState("");
  const [initTitle, setInitTitle] = useState("");
  const [initDesc, setInitDesc] = useState("");
  const [initStatus, setInitStatus] = useState("");
  const [initBusy, setInitBusy] = useState(false);

  const [projectSlugExtra, setProjectSlugExtra] = useState<string[]>([]);
  const [workshopSlugExtra, setWorkshopSlugExtra] = useState<string[]>([]);

  // Persist quick selections for convenience
  useEffect(() => {
    sessionStorage.setItem("ADMIN_UPLOAD_KIND", uploadKind);
  }, [uploadKind]);
  useEffect(() => {
    if (projectSlug) sessionStorage.setItem("ADMIN_PROJECT_SLUG", projectSlug);
  }, [projectSlug]);
  useEffect(() => {
    if (workshopSlug) sessionStorage.setItem("ADMIN_WORKSHOP_SLUG", workshopSlug);
  }, [workshopSlug]);

  // Precompute dropdown options
  const projectSlugOptions = useMemo(() => {
    try {
      const base = projects.map((p) => p.slug);
      const merged = Array.from(new Set([...base, ...projectSlugExtra]));
      return merged.sort((a, b) => a.localeCompare(b));
    } catch {
      return projectSlugExtra.slice().sort((a, b) => a.localeCompare(b));
    }
  }, [projectSlugExtra]);
  const workshopSlugOptions = useMemo(() => {
    const base = ["git-101", "intro-to-stm32", "pcb-design-101", "template"];
    const merged = Array.from(new Set([...base, ...workshopSlugExtra]));
    return merged.sort((a, b) => a.localeCompare(b));
  }, [workshopSlugExtra]);

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
    setEvtBusy(true);
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
        // Timed events: enforce seconds, use fixed Indianapolis timezone
        const ensureSeconds = (s: string) => {
          if (!s) return s;
          return /T\d{2}:\d{2}:\d{2}/.test(s) ? s : `${s}:00`;
        };
        payload.startISO = ensureSeconds(evt.startISO);
        payload.endISO = ensureSeconds(evt.endISO);
        payload.timeZone = DEFAULT_TIME_ZONE;
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
      let body: any = null;
      try { body = await res.json(); } catch { body = await res.text(); }
      if (!res.ok) {
        const msg = typeof body === "string"
          ? body
          : body?.detail?.error?.message || body?.detail?.error || body?.detail || body?.error || res.statusText;
        throw new Error(`${res.status} ${msg}`);
      }
  setEvtStatus("Event created ✅");
  setEvt({ title: "", startISO: "", endISO: "", url: "", description: "", location: "" });
  setIsAllDay(false);
  setStartDate("");
  setEndDate("");
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
    } finally {
      setEvtBusy(false);
    }
  }

  async function handleUploadMedia(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) {
      setMediaStatus("Please choose at least one file.");
      return;
    }
    setMediaBusy(true);
    setMediaStatus("Uploading...");
    try {
      setPrUrl("");
      // GitHub PR upload only
      const chosenSlug = uploadKind === "project" ? projectSlug.trim() : workshopSlug.trim();
      if (!chosenSlug) {
        setMediaStatus(`Please choose a ${uploadKind} slug for the GitHub upload.`);
        return;
      }
      const form = new FormData();
      form.set("projectSlug", chosenSlug);
      form.set("kind", uploadKind);
      form.set("title", title);
      if (desc) form.set("description", desc);
      Array.from(files).forEach((f) => form.append("files", f));

      const base = apiBase || "";
      const res = await fetch(`${base}/api/media/upload-gh`, {
        method: "POST",
        headers: token ? { authorization: `Bearer ${token}` } : {},
        body: form,
      });
      let body: any = null;
      try { body = await res.json(); } catch { body = await res.text(); }
      if (!res.ok) {
        const msg = typeof body === "string" ? body : body?.error || body?.detail || res.statusText;
        throw new Error(`${res.status} ${msg}`);
      }
  setMediaStatus("PR opened ✅");
      if (typeof body === "object" && body?.pullRequestUrl) setPrUrl(body.pullRequestUrl);
      setTitle("");
      setDesc("");
      (document.getElementById("media-files") as HTMLInputElement).value = "";
      setFiles(null);
    } catch (err: any) {
      setMediaStatus(`Error: ${err.message || String(err)}`);
    } finally {
      setMediaBusy(false);
    }
  }

  async function handleInitSlugSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInitBusy(true);
    setInitStatus("Creating...");
    setPrUrl("");
    try {
      const slug = initSlug.trim();
      if (!slug) {
        setInitStatus("Please enter a slug.");
        setInitBusy(false);
        return;
      }
      const form = new FormData();
      form.set("kind", uploadKind);
      form.set("slug", slug);
      if (initTitle.trim()) form.set("title", initTitle.trim());
      if (initDesc.trim()) form.set("description", initDesc.trim());
      const base = apiBase || "";
      console.log(`[Init] Creating ${uploadKind} with slug: ${slug}`);
      console.log(`[Init] Calling: ${base}/api/media/init-gh`);
      const res = await fetch(`${base}/api/media/init-gh`, {
        method: "POST",
        headers: token ? { authorization: `Bearer ${token}` } : {},
        body: form,
      });
      console.log(`[Init] Response status: ${res.status}`);
      let body: any = null;
      try { body = await res.json(); } catch { body = await res.text(); }
      console.log(`[Init] Response body:`, body);
      if (!res.ok) {
        const msg = typeof body === "string" ? body : body?.error || body?.detail || res.statusText;
        throw new Error(`${res.status} ${msg}`);
      }
      setInitStatus("PR opened ✅");
      if (typeof body === "object" && body?.pullRequestUrl) setPrUrl(body.pullRequestUrl);
      // Update dropdowns and selection
      if (uploadKind === "project") {
        setProjectSlugExtra((s) => Array.from(new Set([...s, slug])));
        setProjectSlug(slug);
      } else {
        setWorkshopSlugExtra((s) => Array.from(new Set([...s, slug])));
        setWorkshopSlug(slug);
      }
      setInitOpen(false);
      setInitSlug("");
      setInitTitle("");
      setInitDesc("");
    } catch (err: any) {
      console.error(`[Init] Error:`, err);
      setInitStatus(`Error: ${err.message || String(err)}`);
    } finally {
      setInitBusy(false);
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
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <button disabled={checking} onClick={testConnection} className="rounded-md border border-border px-2 py-1 hover:bg-accent disabled:opacity-60">
                {checking ? "Checking…" : "Test connection"}
              </button>
              {apiOk !== null && (
                <span className={`rounded px-2 py-0.5 ${apiOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  API {apiOk ? "OK" : "Down"}
                </span>
              )}
              {authOk !== null && (
                <span className={`rounded px-2 py-0.5 ${authOk ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  Auth {authOk ? "Valid" : "Missing/Invalid"}
                </span>
              )}
            </div>
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
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">Members Forms</h2>
            <p className="mb-4 text-sm text-muted-foreground">Create member profiles from CSV or manual entry.</p>
            <a href="/forms" className="inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">Open Forms</a>
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
              {/* Time zone fixed to Indianapolis (America/Indiana/Indianapolis) */}
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

          <button disabled={evtBusy || !evt.title || (!isAllDay && (!evt.startISO || !evt.endISO)) || (isAllDay && !startDate)} className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60">
            {evtBusy ? "Saving…" : "Create Event"}
          </button>
          {evtStatus && <p className="text-sm text-muted-foreground">{evtStatus}</p>}
        </form>
      </section>
      )}

      {view === "media" && (
      <section className="grid gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Upload Media</h2>
  <form className="grid gap-3" onSubmit={handleUploadMedia}>
          {/* Type toggle: Project vs Workshop */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">Type</span>
              <select
                className="rounded-md border border-border bg-background p-2"
                value={uploadKind}
                onChange={(e) => setUploadKind(e.target.value as any)}
              >
                <option value="project">Project</option>
                <option value="workshop">Workshop</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {uploadKind === "project" ? (
              <div className="grid gap-2">
                <label className="grid gap-1">
                  <span className="text-sm text-muted-foreground">Project Slug</span>
                  <select
                    className="rounded-md border border-border bg-background p-2"
                    value={projectSlug}
                    onChange={(e) => setProjectSlug(e.target.value)}
                    required
                  >
                    <option value="">Select a project…</option>
                    {projectSlugOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="text-xs text-muted-foreground">Files will be committed under public/projects/&lt;slug&gt;/</span>
                </label>
                <div className="text-xs text-muted-foreground">
                  <button type="button" className="underline" onClick={() => { setInitOpen((v) => !v); setInitStatus(""); }}>Create new project</button>
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <label className="grid gap-1">
                  <span className="text-sm text-muted-foreground">Workshop Slug</span>
                  <select
                    className="rounded-md border border-border bg-background p-2"
                    value={workshopSlug}
                    onChange={(e) => setWorkshopSlug(e.target.value)}
                    required
                  >
                    <option value="">Select a workshop…</option>
                    {workshopSlugOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="text-xs text-muted-foreground">Markdown goes to content/workshops, images to public/workshops/&lt;slug&gt;/</span>
                </label>
                <div className="text-xs text-muted-foreground">
                  <button type="button" className="underline" onClick={() => { setInitOpen((v) => !v); setInitStatus(""); }}>Create new workshop</button>
                </div>
              </div>
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

          {initOpen && (
            <form className="grid gap-2 rounded-md border border-dashed border-border p-3" onSubmit={handleInitSlugSubmit}>
              <div className="text-sm font-medium">Initialize new {uploadKind}</div>
              <div className="grid gap-2 md:grid-cols-3">
                <label className="grid gap-1">
                  <span className="text-xs text-muted-foreground">Slug</span>
                  <input className="rounded-md border border-border bg-background p-2" value={initSlug} onChange={(e) => setInitSlug(e.target.value)} placeholder={uploadKind === "project" ? "e.g., smart-watch" : "e.g., intro-to-xyz"} required />
                </label>
                <label className="grid gap-1 md:col-span-2">
                  <span className="text-xs text-muted-foreground">Title (optional)</span>
                  <input className="rounded-md border border-border bg-background p-2" value={initTitle} onChange={(e) => setInitTitle(e.target.value)} placeholder="Display title" />
                </label>
              </div>
              <label className="grid gap-1">
                <span className="text-xs text-muted-foreground">Description (optional)</span>
                <textarea className="min-h-[80px] rounded-md border border-border bg-background p-2" value={initDesc} onChange={(e) => setInitDesc(e.target.value)} />
              </label>
              <div className="flex items-center gap-2">
                <button disabled={initBusy || !initSlug} className="rounded-md border border-border px-3 py-2 text-sm disabled:opacity-60">{initBusy ? "Creating…" : "Create"}</button>
                {initStatus && <span className="text-xs text-muted-foreground">{initStatus}</span>}
              </div>
            </form>
          )}

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
              Files (images, videos, PDFs, markdown, code, CSV, HTML)
            </span>
            <input
              id="media-files"
              type="file"
              accept={[
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
              ].join(",")}
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="rounded-md border border-border bg-background p-2"
            />
          </label>

          <button disabled={mediaBusy || !title || !files || files.length === 0 || !((uploadKind === "project" && projectSlug) || (uploadKind === "workshop" && workshopSlug))} className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60">
            {mediaBusy ? "Uploading…" : "Upload"}
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

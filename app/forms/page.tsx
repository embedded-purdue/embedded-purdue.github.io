"use client";

import { useEffect, useMemo, useState } from "react";

type Member = {
  name: string;
  major: string;
  position: string;
  level: "exec" | "pm" | "admin" | "";
  email?: string;
  linkedin?: string;
  photoUrl?: string;
};

export default function MembersFormsPage() {
  const [apiBase, setApiBase] = useState<string>((process.env.NEXT_PUBLIC_API_BASE as string) || "");
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [apiOk, setApiOk] = useState<null | boolean>(null);
  const [authOk, setAuthOk] = useState<null | boolean>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("ADMIN_TOKEN") || "";
    const savedUser = sessionStorage.getItem("ADMIN_USER") || "";
    const savedApi = sessionStorage.getItem("ADMIN_API_BASE") || "";
    if (saved) setToken(saved);
    if (savedUser) setUsername(savedUser);
    if (savedApi) setApiBase(savedApi);
    else if (typeof window !== "undefined") {
      const isLocal = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && window.location.port === "3000";
      if (isLocal) setApiBase("http://127.0.0.1:8000");
    }
  }, []);

  async function testConnection() {
    try {
      setChecking(true);
      setApiOk(null);
      setAuthOk(null);
      const base = apiBase || "";
      const hr = await fetch(`${base}/api/health`, { cache: "no-store" });
      setApiOk(hr.ok);
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

  // CSV upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvBusy, setCsvBusy] = useState(false);
  const [csvStatus, setCsvStatus] = useState<string>("");

  async function handleCsvSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!csvFile) {
      setCsvStatus("Please choose a CSV file.");
      return;
    }
    setCsvBusy(true);
    setCsvStatus("Uploading…");
    try {
      const form = new FormData();
      form.set("file", csvFile);
      const base = apiBase || "";
      const res = await fetch(`${base}/api/members/csv`, {
        method: "POST",
        headers: token ? { authorization: `Bearer ${token}` } : {},
        body: form,
      });
      let body: any = null;
      try { body = await res.json(); } catch { body = await res.text(); }
      if (!res.ok) {
        const msg = typeof body === "string" ? body : body?.detail || body?.error || res.statusText;
        throw new Error(`${res.status} ${msg}`);
      }
      const count = (typeof body === "object" && body?.count) || 0;
      setCsvStatus(`Imported ${count} member${count === 1 ? "" : "s"} ✅`);
      setCsvFile(null);
      const input = document.getElementById("csv-file") as HTMLInputElement | null;
      if (input) input.value = "";
      // refresh list
      await fetchMembers();
    } catch (err: any) {
      setCsvStatus(`Error: ${err.message || String(err)}`);
    } finally {
      setCsvBusy(false);
    }
  }

  // Manual list state
  const [rows, setRows] = useState<Member[]>([
    { name: "", major: "", position: "", level: "", email: "", linkedin: "", photoUrl: "" },
  ]);
  const [manualBusy, setManualBusy] = useState(false);
  const [manualStatus, setManualStatus] = useState<string>("");

  function addRow() {
    setRows((r) => [...r, { name: "", major: "", position: "", level: "", email: "", linkedin: "", photoUrl: "" }]);
  }
  function removeRow(idx: number) {
    setRows((r) => r.filter((_, i) => i !== idx));
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = rows.filter((r) => r.name && r.major && r.position && (r.level === "exec" || r.level === "pm" || r.level === "admin"));
    if (payload.length === 0) {
      setManualStatus("Please complete at least one row.");
      return;
    }
    setManualBusy(true);
    setManualStatus("Saving…");
    try {
      const base = apiBase || "";
      const res = await fetch(`${base}/api/members`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ members: payload }),
      });
      let body: any = null;
      try { body = await res.json(); } catch { body = await res.text(); }
      if (!res.ok) {
        const msg = typeof body === "string" ? body : body?.detail || body?.error || res.statusText;
        throw new Error(`${res.status} ${msg}`);
      }
      const count = (typeof body === "object" && body?.count) || payload.length;
      setManualStatus(`Saved ${count} member${count === 1 ? "" : "s"} ✅`);
      setRows([{ name: "", major: "", position: "", level: "", email: "", linkedin: "", photoUrl: "" }]);
      // refresh list
      await fetchMembers();
    } catch (err: any) {
      setManualStatus(`Error: ${err.message || String(err)}`);
    } finally {
      setManualBusy(false);
    }
  }

  // Listing
  const [listBusy, setListBusy] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  async function fetchMembers(cursor?: number | null) {
    try {
      setListBusy(true);
      const base = apiBase || "";
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (cursor !== undefined && cursor !== null) params.set("cursor", String(cursor));
      const res = await fetch(`${base}/api/members?${params.toString()}`);
      let body: any = null;
      try { body = await res.json(); } catch { body = await res.text(); }
      if (!res.ok) throw new Error(typeof body === "string" ? body : body?.error || res.statusText);
      setMembers(body.items || []);
      setNextCursor(body.nextCursor ?? null);
    } catch (err) {
      // ignore for now
    } finally {
      setListBusy(false);
    }
  }

  useEffect(() => {
    // initial fetch
    fetchMembers(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  const loggedIn = !!token && username === "stm32fan";

  return (
    <div>
      <main className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col gap-8 px-4 py-12">
        <header className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Member Portal</p>
            <h1 className="text-3xl font-bold">Members Forms</h1>
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
          <div className="flex gap-2">
            <a href="/api" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">Back to Hub</a>
          </div>
        </header>

        {!loggedIn && (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
            You are not signed in. Go to <a className="underline" href="/api">/api</a> and sign in first.
          </div>
        )}

        <section className="grid gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Import from CSV</h2>
          <p className="text-sm text-muted-foreground">CSV must include a header row with: name, major, position, level (exec|pm|admin). Optional: email, linkedin, photoUrl/photo/image/picture.</p>
          <form className="grid gap-3 md:grid-cols-3" onSubmit={handleCsvSubmit}>
            <label className="grid gap-1 md:col-span-2">
              <span className="text-sm text-muted-foreground">CSV File</span>
              <input id="csv-file" type="file" accept=".csv,text/csv" className="rounded-md border border-border bg-background p-2" onChange={(e) => setCsvFile(e.target.files?.[0] || null)} />
            </label>
            <div className="flex items-end">
              <button disabled={csvBusy || !csvFile || !loggedIn} className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60">
                {csvBusy ? "Uploading…" : "Import CSV"}
              </button>
            </div>
          </form>
          {csvStatus && <p className="text-sm text-muted-foreground">{csvStatus}</p>}
          <details className="text-xs text-muted-foreground">
            <summary>Sample</summary>
            <pre className="overflow-auto rounded-md border border-border bg-muted p-3">{`name,major,position,level,email,linkedin,photoUrl\nJane Doe,Computer Engineering,Treasurer,exec,jane@purdue.edu,https://linkedin.com/in/janedoe,https://example.com/jane.jpg\nJohn Smith,Electrical Engineering,Project Lead,pm,john@purdue.edu,https://linkedin.com/in/johnsmith,https://example.com/john.jpg`}</pre>
          </details>
        </section>

        <section className="grid gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Add Manually</h2>
          <form className="grid gap-3" onSubmit={handleManualSubmit}>
            <div className="grid gap-3">
              {rows.map((r, idx) => {
                return (
                  <div key={idx} className="grid gap-3 md:grid-cols-8 items-center">
                    <input
                      className="rounded-md border border-border bg-background p-2"
                      placeholder="Name"
                      value={r.name}
                      onChange={e => setRows(rows => rows.map((row, i) => i === idx ? { ...row, name: e.target.value } : row))}
                    />
                    <input
                      className="rounded-md border border-border bg-background p-2"
                      placeholder="Major"
                      value={r.major}
                      onChange={e => setRows(rows => rows.map((row, i) => i === idx ? { ...row, major: e.target.value } : row))}
                    />
                    <input
                      className="rounded-md border border-border bg-background p-2"
                      placeholder="Position"
                      value={r.position}
                      onChange={e => setRows(rows => rows.map((row, i) => i === idx ? { ...row, position: e.target.value } : row))}
                    />
                    <select
                      aria-label="Level"
                      className="rounded-md border border-border bg-background p-2"
                      value={r.level}
                      onChange={e => setRows(rows => rows.map((row, i) => i === idx ? { ...row, level: e.target.value as any } : row))}
                    >
                      <option value="">level…</option>
                      <option value="exec">exec</option>
                      <option value="pm">pm</option>
                      <option value="admin">admin</option>
                    </select>
                    <input
                      className="rounded-md border border-border bg-background p-2"
                      placeholder="Email (optional)"
                      type="email"
                      value={r.email || ""}
                      onChange={e => setRows(rows => rows.map((row, i) => i === idx ? { ...row, email: e.target.value } : row))}
                    />
                    <input
                      className="rounded-md border border-border bg-background p-2"
                      placeholder="LinkedIn URL (optional)"
                      type="url"
                      value={r.linkedin || ""}
                      onChange={e => setRows(rows => rows.map((row, i) => i === idx ? { ...row, linkedin: e.target.value } : row))}
                    />
                    <input
                      className="rounded-md border border-border bg-background p-2"
                      placeholder="Picture URL (optional)"
                      type="url"
                      value={r.photoUrl || ""}
                      onChange={e => setRows(rows => rows.map((row, i) => i === idx ? { ...row, photoUrl: e.target.value } : row))}
                    />
                    {rows.length > 1 && (
                      <button type="button" className="text-xs underline" onClick={() => removeRow(idx)}>Remove</button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-md border border-border px-3 py-2 text-sm" onClick={addRow}>Add another</button>
              <button disabled={manualBusy || !loggedIn} className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60">
                {manualBusy ? "Saving…" : "Save"}
              </button>
            </div>
            {manualStatus && <p className="text-sm text-muted-foreground">{manualStatus}</p>}
          </form>
        </section>

        <section className="grid gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Members</h2>
          <div className="flex items-end gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">Search</span>
              <input className="rounded-md border border-border bg-background p-2" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="name, major, position" />
            </label>
            <button onClick={() => fetchMembers(undefined)} className="rounded-md border border-border px-3 py-2 text-sm">Search</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="border-b border-border p-2">Name</th>
                  <th className="border-b border-border p-2">Major</th>
                  <th className="border-b border-border p-2">Position</th>
                  <th className="border-b border-border p-2">Level</th>
                  <th className="border-b border-border p-2">Email</th>
                  <th className="border-b border-border p-2">LinkedIn</th>
                  <th className="border-b border-border p-2">Picture</th>
                  <th className="border-b border-border p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="odd:bg-muted/40">
                    <td className="border-b border-border p-2">{m.name}</td>
                    <td className="border-b border-border p-2">{m.major}</td>
                    <td className="border-b border-border p-2">{m.position}</td>
                    <td className="border-b border-border p-2 uppercase">{m.level}</td>
                    <td className="border-b border-border p-2 text-xs">
                      {m.email ? <a href={`mailto:${m.email}`} className="underline text-blue-700 hover:text-blue-900">{m.email}</a> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="border-b border-border p-2 text-xs">
                      {m.linkedin ? <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="underline text-blue-700 hover:text-blue-900">LinkedIn</a> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="border-b border-border p-2 text-xs">
                      {m.photoUrl ? <img src={m.photoUrl} alt={m.name + " photo"} className="h-8 w-8 rounded-full object-cover border" /> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="border-b border-border p-2 text-xs text-muted-foreground">{m.createdAt}</td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-3 text-center text-sm text-muted-foreground">No members yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button disabled={listBusy || nextCursor == null} onClick={() => fetchMembers(nextCursor)} className="rounded-md border border-border px-3 py-2 disabled:opacity-60">Load more</button>
            <span className="text-muted-foreground">{listBusy ? "Loading…" : null}</span>
          </div>
        </section>
      </main>
    </div>
  );
}

// app/api/page.tsx
"use client";

import { useEffect, useState } from "react";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE as string) || ""; // "" = same-origin (when hosted on Vercel)

type CreateEventPayload = {
  title: string;
  startISO: string;
  endISO: string;
  url?: string;
  description?: string;
  location?: string;
};

export default function AdminPage() {
  // --- Admin token (for Authorization header) ---
  const [token, setToken] = useState("");
  useEffect(() => {
    const saved = sessionStorage.getItem("ADMIN_TOKEN") || "";
    if (saved) setToken(saved);
  }, []);
  function persistToken(v: string) {
    setToken(v);
    sessionStorage.setItem("ADMIN_TOKEN", v);
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

  // --- Media form state ---
  const [kind, setKind] = useState<"project" | "workshop" | "other">("project");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [mediaStatus, setMediaStatus] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"blob" | "github">("blob");
  const [projectSlug, setProjectSlug] = useState("");
  const [prUrl, setPrUrl] = useState<string>("");

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setEvtStatus("Saving...");
    try {
      const res = await fetch(`${API_BASE}/api/events`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(evt),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || res.statusText);
      setEvtStatus("Event created ✅");
      setEvt({ title: "", startISO: "", endISO: "", url: "", description: "", location: "" });
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

        const res = await fetch(`${API_BASE}/api/media/upload-gh`, {
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

        const res = await fetch(`${API_BASE}/api/media/upload`, {
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

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-8 px-4 py-12">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Member Portal</p>
        <h1 className="text-4xl font-bold">Admin</h1>
        <p className="text-base text-muted-foreground">
          Create events and upload media to your Vercel API.
        </p>
      </header>

      {/* Admin token */}
      <section className="grid gap-3 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Admin Access</h2>
        <label className="grid gap-1">
          <span className="text-sm text-muted-foreground">Authorization token</span>
          <input
            type="password"
            className="rounded-md border border-border bg-background p-2"
            value={token}
            onChange={(e) => persistToken(e.target.value)}
            placeholder="Paste ADMIN_TOKEN"
          />
        </label>
        {API_BASE && (
          <p className="text-xs text-muted-foreground">
            Using external API base: <code>{API_BASE}</code>
          </p>
        )}
      </section>

      {/* Create Event */}
      <section className="grid gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Create Event</h2>
        <form className="grid gap-3" onSubmit={handleCreateEvent}>
          <label className="grid gap-1">
            <span className="text-sm text-muted-foreground">Title</span>
            <input
              className="rounded-md border border-border bg-background p-2"
              value={evt.title}
              onChange={(e) => setEvt((s) => ({ ...s, title: e.target.value }))}
              required
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">Start</span>
              <input
                type="datetime-local"
                className="rounded-md border border-border bg-background p-2"
                value={evt.startISO}
                onChange={(e) => setEvt((s) => ({ ...s, startISO: e.target.value }))}
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-muted-foreground">End</span>
              <input
                type="datetime-local"
                className="rounded-md border border-border bg-background p-2"
                value={evt.endISO}
                onChange={(e) => setEvt((s) => ({ ...s, endISO: e.target.value }))}
                required
              />
            </label>
          </div>
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

          <button className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground">
            Create Event
          </button>
          {evtStatus && <p className="text-sm text-muted-foreground">{evtStatus}</p>}
        </form>
      </section>

      {/* Upload Media */}
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
    </main>
  );
}

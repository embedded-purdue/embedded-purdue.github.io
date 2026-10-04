"use client";

import { useEffect, useState } from "react";
import { ChangeTracker } from "@/components/cms/ChangeTracker";
import { CmsDirectory } from "@/components/cms/CmsDirectory";
import { CmsHeader } from "@/components/cms/CmsHeader";
import { StringListEditor } from "@/components/cms/StringListEditor";
import {
  fieldClass,
  fileButtonClass,
  labelClass,
  panelClass,
} from "@/components/cms/editor-styles";
import { projectIconKeys } from "@/lib/project-icon-keys";
import type {
  ChangeSummary,
  CmsAsset,
  CmsDirectoryItem,
  CmsSnapshot,
  ProjectContent,
  PublishMode,
  PublishResult,
  Tab,
  TeamMemberContent,
  TeamSection,
  WorkshopContent,
} from "@/lib/cms/editor-types";

const projectIconOptions = projectIconKeys;
const teamSectionLabels: Record<TeamSection, string> = {
  exec: "Executives",
  committee: "Committees",
  pm: "Project managers",
  member: "Members",
};
const teamStatusOptions = ["all", "active", "inactive"] as const;
type TeamStatusFilter = (typeof teamStatusOptions)[number];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function csv(value: string[]) {
  return value.join(", ");
}
function csvToArray(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}
function jumpToEntry(kind: "project" | "team" | "workshop", index: number) {
  window.setTimeout(() => {
    const panel = document.querySelector<HTMLElement>(
      `[data-cms-${kind}-index="${index}"]`,
    );
    panel?.scrollIntoView({ behavior: "smooth", block: "start" });
    panel?.querySelector<HTMLElement>("input, textarea, select")?.focus();
  }, 0);
}
function extensionFor(file: File) {
  return (
    file.name.split(".").pop()?.toLowerCase() ||
    (file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "bin")
  );
}

function itemLabel(value: { title?: string; name?: string; slug?: string }) {
  return value.title || value.name || value.slug || "Untitled item";
}

function jsonKey(value: unknown) {
  return JSON.stringify(value);
}
function managerText(project: ProjectContent) {
  return project.pm ?? csv(project.pms || []);
}
function uniquePaths(paths: string[]) {
  return Array.from(new Set(paths.map((path) => path.trim()).filter(Boolean)));
}
function changedFieldList<T extends Record<string, unknown>>(
  current: T,
  previous: T,
  labels: Partial<Record<keyof T, string>>,
) {
  return (Object.keys(labels) as Array<keyof T>)
    .filter((key) => jsonKey(current[key]) !== jsonKey(previous[key]))
    .map((key) => labels[key])
    .filter(Boolean) as string[];
}
function formatUpdate(label: string, fields: string[]) {
  return fields.length
    ? `${label} updated: ${fields.join(", ")}`
    : `${label} updated`;
}
function collectChangedLabels(
  current: CmsSnapshot,
  original: CmsSnapshot | null,
  assets: CmsAsset[],
): ChangeSummary[] {
  const changes: ChangeSummary[] = [];
  if (!original) return changes;

  function summary(
    kind: ChangeSummary["kind"],
    item: string,
    path: string,
    fields: string[] = [],
    beforeLabel?: string,
    afterLabel?: string,
  ): ChangeSummary {
    const label =
      kind === "added"
        ? `${item} added`
        : kind === "removed"
          ? `${item} removed`
          : kind === "uploaded"
            ? `${item} uploaded`
            : beforeLabel && afterLabel
              ? `${beforeLabel} renamed/updated to ${afterLabel}`
              : formatUpdate(item, fields);

    return {
      label,
      path,
      kind,
      item,
      fields: fields.length ? fields : undefined,
      beforeLabel,
      afterLabel,
    };
  }

  const usedProjectIndexes = new Set<number>();
  for (let index = 0; index < current.projects.length; index++) {
    const project = current.projects[index];
    const previousIndex = original.projects.findIndex(
      (candidate, candidateIndex) =>
        !usedProjectIndexes.has(candidateIndex) &&
        candidate.slug === project.slug,
    );
    const fallbackIndex =
      previousIndex >= 0
        ? previousIndex
        : index < original.projects.length && !usedProjectIndexes.has(index)
          ? index
          : -1;
    const previous =
      fallbackIndex >= 0 ? original.projects[fallbackIndex] : undefined;

    if (!previous) {
      changes.push(
        summary("added", itemLabel(project), "content/projects.json", [
          "new project",
        ]),
      );
    } else if (jsonKey(project) !== jsonKey(previous)) {
      usedProjectIndexes.add(fallbackIndex);
      const renamed =
        previous.slug !== project.slug || previous.title !== project.title;
      const fields = changedFieldList(
        { ...project, pm: managerText(project) },
        { ...previous, pm: managerText(previous) },
        {
          title: "title",
          slug: "slug",
          description: "description",
          technologies: "technologies",
          status: "status",
          icon: "icon",
          image: "cover image",
          images: "carousel images",
          pm: "PMs",
          semester: "semester",
          readmeUrl: "read more URL",
        },
      );
      changes.push(
        summary(
          "updated",
          itemLabel(project),
          "content/projects.json",
          fields,
          renamed ? itemLabel(previous) : undefined,
          renamed ? itemLabel(project) : undefined,
        ),
      );
    } else usedProjectIndexes.add(fallbackIndex);
  }
  original.projects.forEach((project, index) => {
    if (!usedProjectIndexes.has(index))
      changes.push(
        summary("removed", itemLabel(project), "content/projects.json", [
          "removed project",
        ]),
      );
  });

  const usedTeamIndexes = new Set<number>();
  for (let index = 0; index < current.team.length; index++) {
    const member = current.team[index];
    const previousIndex = original.team.findIndex(
      (candidate, candidateIndex) =>
        !usedTeamIndexes.has(candidateIndex) && candidate.name === member.name,
    );
    const fallbackIndex =
      previousIndex >= 0
        ? previousIndex
        : index < original.team.length && !usedTeamIndexes.has(index)
          ? index
          : -1;
    const previous =
      fallbackIndex >= 0 ? original.team[fallbackIndex] : undefined;

    if (!previous) {
      changes.push(
        summary("added", itemLabel(member), "content/team.json", [
          "new member",
        ]),
      );
    } else if (jsonKey(member) !== jsonKey(previous)) {
      usedTeamIndexes.add(fallbackIndex);
      const fields = changedFieldList(member, previous, {
        name: "name",
        role: "primary role",
        roles: "roles",
        section: "section",
        level: "level",
        email: "email",
        linkedin: "LinkedIn",
        github: "GitHub",
        image: "image",
        order: "order",
        active: "active state",
      });
      const renamed = previous.name !== member.name;
      changes.push(
        summary(
          "updated",
          itemLabel(member),
          "content/team.json",
          fields,
          renamed ? itemLabel(previous) : undefined,
          renamed ? itemLabel(member) : undefined,
        ),
      );
    } else usedTeamIndexes.add(fallbackIndex);
  }
  original.team.forEach((member, index) => {
    if (!usedTeamIndexes.has(index))
      changes.push(
        summary("removed", itemLabel(member), "content/team.json", [
          "removed member",
        ]),
      );
  });

  const usedWorkshopIndexes = new Set<number>();
  for (let index = 0; index < current.workshops.length; index++) {
    const workshop = current.workshops[index];
    const previousIndex = original.workshops.findIndex(
      (candidate, candidateIndex) =>
        !usedWorkshopIndexes.has(candidateIndex) &&
        candidate.slug === workshop.slug,
    );
    const fallbackIndex =
      previousIndex >= 0
        ? previousIndex
        : index < original.workshops.length && !usedWorkshopIndexes.has(index)
          ? index
          : -1;
    const previous =
      fallbackIndex >= 0 ? original.workshops[fallbackIndex] : undefined;
    const pathFor = (entry: WorkshopContent) =>
      `content/workshops/${entry.slug}.md`;

    if (!previous) {
      changes.push(
        summary("added", itemLabel(workshop), pathFor(workshop), [
          "new workshop",
        ]),
      );
    } else if (jsonKey(workshop) !== jsonKey(previous)) {
      usedWorkshopIndexes.add(fallbackIndex);
      const fields = changedFieldList(workshop, previous, {
        title: "title",
        slug: "slug",
        date: "date",
        location: "location",
        summary: "summary",
        tags: "tags",
        cover: "cover",
        body: "body",
      });
      const renamed =
        previous.slug !== workshop.slug || previous.title !== workshop.title;
      changes.push(
        summary(
          "updated",
          itemLabel(workshop),
          pathFor(workshop),
          fields,
          renamed ? itemLabel(previous) : undefined,
          renamed ? itemLabel(workshop) : undefined,
        ),
      );
    } else usedWorkshopIndexes.add(fallbackIndex);
  }
  original.workshops.forEach((workshop, index) => {
    if (!usedWorkshopIndexes.has(index))
      changes.push(
        summary(
          "removed",
          itemLabel(workshop),
          `content/workshops/${workshop.slug}.md`,
          ["removed workshop"],
        ),
      );
  });

  for (const asset of assets) {
    const item = asset.path.split("/").pop() || asset.path;
    changes.push(summary("uploaded", item, asset.path, ["asset upload"]));
  }

  return changes;
}
async function readFileAsBase64(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  return dataUrl.split(",")[1] || "";
}

export default function CmsPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<CmsSnapshot | null>(null);
  const [originalSnapshot, setOriginalSnapshot] = useState<CmsSnapshot | null>(
    null,
  );
  const [assets, setAssets] = useState<CmsAsset[]>([]);
  const [tab, setTab] = useState<Tab>("projects");
  const [mode, setMode] = useState<PublishMode>("pr");
  const [message, setMessage] = useState("CMS: update site content");
  const [status, setStatus] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [deploy, setDeploy] = useState<{ state: string; url?: string } | null>(
    null,
  );
  const [teamQuery, setTeamQuery] = useState("");
  const [teamSectionFilter, setTeamSectionFilter] = useState<
    TeamSection | "all"
  >("all");
  const [teamStatusFilter, setTeamStatusFilter] =
    useState<TeamStatusFilter>("all");

  useEffect(() => {
    fetch("/api/cms/session")
      .then((res) => res.json())
      .then((body: { authenticated: boolean }) => {
        setAuthenticated(body.authenticated);
        if (!body.authenticated) setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    fetch("/api/cms/snapshot")
      .then((res) => res.json())
      .then((body: CmsSnapshot | { error: string }) => {
        if ("error" in body) throw new Error(body.error);
        setSnapshot(body);
        setOriginalSnapshot(body);
        setStatus(
          body.baseCommitSha
            ? `Loaded ${body.baseBranch} @ ${body.baseCommitSha.slice(0, 7)}`
            : `Loaded ${body.baseBranch}`,
        );
      })
      .catch((err: Error) => setStatus(err.message))
      .finally(() => setLoading(false));
  }, [authenticated]);

  const changedFiles = snapshot
    ? collectChangedLabels(snapshot, originalSnapshot, assets)
    : [];
  const normalizedTeamQuery = teamQuery.trim().toLowerCase();
  const teamEntries = snapshot
    ? snapshot.team.map((member, index) => ({ member, index }))
    : [];
  const visibleTeamEntries = teamEntries.filter(({ member }) => {
    const haystack = [
      member.name,
      member.role,
      ...(member.roles || []),
      member.section,
      member.level,
      member.email,
      member.linkedin,
      member.github,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesQuery =
      !normalizedTeamQuery || haystack.includes(normalizedTeamQuery);
    const matchesSection =
      teamSectionFilter === "all" || member.section === teamSectionFilter;
    const matchesStatus =
      teamStatusFilter === "all" ||
      (teamStatusFilter === "active" ? member.active : !member.active);
    return matchesQuery && matchesSection && matchesStatus;
  });
  const teamSectionCounts = teamEntries.reduce<Record<TeamSection, number>>(
    (counts, { member }) => ({
      ...counts,
      [member.section]: counts[member.section] + 1,
    }),
    { exec: 0, committee: 0, pm: 0, member: 0 },
  );
  const cmsDirectoryItems: CmsDirectoryItem[] = !snapshot
    ? []
    : tab === "projects"
      ? snapshot.projects.map((project, index) => ({
          label: project.title || project.slug || "Untitled project",
          detail: [
            project.status,
            managerText(project)
              ? `PM: ${managerText(project)}`
              : "No PM listed",
          ].join(" · "),
          badge: project.semester || project.icon || undefined,
          target: { kind: "project", index },
        }))
      : tab === "team"
        ? visibleTeamEntries.map(({ member, index }) => ({
            label: member.name || "Unnamed member",
            detail:
              (member.roles && member.roles.length
                ? member.roles.join(", ")
                : member.role) || teamSectionLabels[member.section],
            badge: member.active ? "active" : "hidden",
            target: { kind: "team", index },
          }))
        : tab === "workshops"
          ? snapshot.workshops.map((workshop, index) => ({
              label: workshop.title || workshop.slug || "Untitled workshop",
              detail: [
                workshop.date || "No date",
                workshop.location || "No location",
              ].join(" · "),
              badge: workshop.tags[0] || undefined,
              target: { kind: "workshop", index },
            }))
          : tab === "preview"
            ? [
                {
                  label: "Projects",
                  detail: `${snapshot.projects.length} project entries`,
                  badge: "view",
                  tabTarget: "projects" as Tab,
                },
                {
                  label: "Team",
                  detail: `${snapshot.team.filter((member) => member.active).length} active people`,
                  badge: "view",
                  tabTarget: "team" as Tab,
                },
                {
                  label: "Workshops",
                  detail: `${snapshot.workshops.length} workshop entries`,
                  badge: "view",
                  tabTarget: "workshops" as Tab,
                },
              ]
            : assets.map((asset) => ({
                label: asset.path.split("/").pop() || asset.path,
                detail: asset.path,
                badge: extensionFor({ name: asset.path, type: "" } as File),
              }));

  function updateSnapshot(next: Partial<CmsSnapshot>) {
    setSnapshot((current) => (current ? { ...current, ...next } : current));
  }
  async function login() {
    setStatus("Signing in…");
    const res = await fetch("/api/cms/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const body = (await res.json()) as { error?: string };
    if (!res.ok) {
      setStatus(body.error || "Login failed.");
      return;
    }
    setAuthenticated(true);
    setPassword("");
  }
  async function publish() {
    if (!snapshot) return;
    setPublishing(true);
    setStatus("Publishing to GitHub…");
    setDeploy(null);
    try {
      const res = await fetch("/api/cms/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...snapshot, mode, message, assets }),
      });
      const body = (await res.json()) as PublishResult | { error: string };
      if (!res.ok || "error" in body)
        throw new Error("error" in body ? body.error : "Publish failed.");
      setAssets([]);
      setStatus(
        body.pullRequestUrl
          ? `PR opened: ${body.pullRequestUrl}`
          : body.warning
            ? `Branch pushed but PR creation failed: ${body.warning}. Open it manually from ${body.branchUrl || body.branch}`
            : `Pushed ${body.commitSha.slice(0, 7)} to ${body.branch}`,
      );
      pollDeploy();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Publish failed.");
    } finally {
      setPublishing(false);
    }
  }
  function pollDeploy() {
    fetch("/api/cms/deploy-status")
      .then((res) => res.json())
      .then((body: { state: string; url?: string }) => setDeploy(body))
      .catch(() => setDeploy(null));
  }
  async function attachAsset(
    file: File,
    pathPrefix: string,
    publicPath: string,
    onPath: (path: string) => void,
  ) {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const repoPath = `${pathPrefix}/${safeName}`;
    const contentBase64 = await readFileAsBase64(file);
    setAssets((current) => [
      ...current.filter((asset) => asset.path !== repoPath),
      { path: repoPath, contentBase64, encoding: "base64" },
    ]);
    onPath(`${publicPath}/${safeName}`);
  }

  if (loading)
    return (
      <main className="grid min-h-screen place-items-center bg-[#0c0c0b] font-mono text-xs uppercase tracking-[0.16em] text-[#8d867b]">
        Loading CMS…
      </main>
    );
  if (!authenticated)
    return (
      <main className="grid min-h-screen place-items-center bg-[#0c0c0b] px-4 text-[#f3efe6]">
        <form
          className="w-full max-w-sm border border-white/10 bg-[#11110f] p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void login();
          }}
        >
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#daa000]">
            ES@P CMS
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-[-0.05em]">
            Sign in
          </h1>
          <label className={`${labelClass} mt-6`}>
            CMS password
            <input
              className={fieldClass}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button className="mt-5 w-full bg-[#daa000] px-4 py-3 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-black">
            Enter CMS
          </button>
          {status && <p className="mt-4 text-sm text-[#aaa398]">{status}</p>}
        </form>
      </main>
    );
  if (!snapshot)
    return (
      <main className="grid min-h-screen place-items-center bg-[#0c0c0b] text-sm text-red-300">
        {status || "Snapshot failed."}
      </main>
    );

  return (
    <main className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <CmsHeader
        baseBranch={snapshot.baseBranch}
        baseCommitSha={snapshot.baseCommitSha}
        mode={mode}
        message={message}
        publishing={publishing}
        status={status}
        pendingUploadCount={assets.length}
        changedCount={changedFiles.length}
        deploy={deploy}
        onModeChange={setMode}
        onMessageChange={setMessage}
        onPublish={publish}
      />
      <ChangeTracker changes={changedFiles} />
      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[220px_1fr]">
        <CmsDirectory
          activeTab={tab}
          items={cmsDirectoryItems}
          onTabChange={setTab}
          onJumpToEntry={jumpToEntry}
        />
        <section className="space-y-4">
          {tab === "projects" && (
            <div className="space-y-4">
              <button
                className="border border-white/10 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#daa000]"
                onClick={() => {
                  const index = snapshot.projects.length;
                  updateSnapshot({
                    projects: [
                      ...snapshot.projects,
                      {
                        slug: "new-project",
                        title: "New project",
                        technologies: [],
                        status: "Planned",
                        icon: "cpu",
                        image: "",
                        images: [],
                        readmeUrl: "/projects/new-project",
                      },
                    ],
                  });
                  jumpToEntry("project", index);
                }}
              >
                + Add project
              </button>
              {snapshot.projects.map((project, index) => (
                <article
                  key={`project-${index}`}
                  data-cms-project-index={index}
                  className={panelClass}
                >
                  <div className="grid gap-3 lg:grid-cols-3">
                    <label className={labelClass}>
                      Title
                      <input
                        className={fieldClass}
                        value={project.title}
                        onChange={(event) =>
                          updateSnapshot({
                            projects: snapshot.projects.map((entry, i) =>
                              i === index
                                ? { ...entry, title: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Slug
                      <input
                        className={fieldClass}
                        value={project.slug}
                        onChange={(event) =>
                          updateSnapshot({
                            projects: snapshot.projects.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    slug: slugify(event.target.value),
                                  }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Status
                      <select
                        className={fieldClass}
                        value={project.status}
                        onChange={(event) =>
                          updateSnapshot({
                            projects: snapshot.projects.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    status: event.target
                                      .value as ProjectContent["status"],
                                  }
                                : entry,
                            ),
                          })
                        }
                      >
                        <option>Active</option>
                        <option>Planned</option>
                        <option>Completed</option>
                      </select>
                    </label>
                    <label className={`${labelClass} lg:col-span-3`}>
                      Description
                      <textarea
                        className={`${fieldClass} min-h-20`}
                        value={project.description || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            projects: snapshot.projects.map((entry, i) =>
                              i === index
                                ? { ...entry, description: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Technologies
                      <input
                        className={fieldClass}
                        value={csv(project.technologies || [])}
                        onChange={(event) =>
                          updateSnapshot({
                            projects: snapshot.projects.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    technologies: csvToArray(
                                      event.target.value,
                                    ),
                                  }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Icon
                      <select
                        className={fieldClass}
                        value={project.icon || "cpu"}
                        onChange={(event) =>
                          updateSnapshot({
                            projects: snapshot.projects.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    icon: event.target
                                      .value as ProjectContent["icon"],
                                  }
                                : entry,
                            ),
                          })
                        }
                      >
                        {projectIconOptions.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={labelClass}>
                      Cover image path
                      <input
                        className={fieldClass}
                        value={project.image || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            projects: snapshot.projects.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    image: event.target.value,
                                    images: uniquePaths([
                                      event.target.value,
                                      ...(entry.images || []),
                                    ]),
                                  }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <StringListEditor
                      label="Carousel image paths"
                      itemLabel="Image path"
                      addLabel="Add image path"
                      placeholder={`/projects/${project.slug}/image.webp`}
                      allowReorder
                      className="lg:col-span-2"
                      values={
                        project.images || (project.image ? [project.image] : [])
                      }
                      onChange={(images) =>
                        updateSnapshot({
                          projects: snapshot.projects.map((entry, i) =>
                            i === index
                              ? {
                                  ...entry,
                                  images,
                                  image: entry.image || images[0] || "",
                                }
                              : entry,
                          ),
                        })
                      }
                    />
                    <label className={labelClass}>
                      PMs
                      <input
                        className={fieldClass}
                        placeholder="Name, Name"
                        value={project.pm ?? csv(project.pms || [])}
                        onChange={(event) =>
                          updateSnapshot({
                            projects: snapshot.projects.map((entry, i) => {
                              if (i !== index) return entry;
                              const pm = event.target.value;
                              return { ...entry, pm, pms: csvToArray(pm) };
                            }),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Semester
                      <input
                        className={fieldClass}
                        value={project.semester || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            projects: snapshot.projects.map((entry, i) =>
                              i === index
                                ? { ...entry, semester: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Read more URL
                      <input
                        className={fieldClass}
                        value={project.readmeUrl || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            projects: snapshot.projects.map((entry, i) =>
                              i === index
                                ? { ...entry, readmeUrl: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Upload project media
                      <span className={fileButtonClass}>Choose files</span>
                      <input
                        className="sr-only"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => {
                          const files = Array.from(event.target.files || []);
                          for (const file of files)
                            void attachAsset(
                              file,
                              `public/projects/${project.slug}`,
                              `/projects/${project.slug}`,
                              (path) =>
                                updateSnapshot({
                                  projects: snapshot.projects.map((entry, i) =>
                                    i === index
                                      ? {
                                          ...entry,
                                          image: entry.image || path,
                                          images: uniquePaths([
                                            ...(entry.images || []),
                                            path,
                                          ]),
                                        }
                                      : entry,
                                  ),
                                }),
                            );
                        }}
                      />
                    </label>
                  </div>
                  <button
                    className="mt-3 text-xs text-red-300 underline"
                    onClick={() =>
                      updateSnapshot({
                        projects: snapshot.projects.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                  >
                    Remove project
                  </button>
                </article>
              ))}
            </div>
          )}
          {tab === "team" && (
            <div className="space-y-4">
              <section className={panelClass}>
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#daa000]">
                      Team browser
                    </p>
                    <h2 className="mt-1 text-xl font-medium tracking-[-0.04em]">
                      Find and edit people without scrolling through every card.
                    </h2>
                    <p className="mt-2 text-sm text-[#8d867b]">
                      Showing {visibleTeamEntries.length} of{" "}
                      {snapshot.team.length} team entries.
                    </p>
                  </div>
                  <button
                    className="w-fit border border-white/10 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#daa000] transition hover:border-[#daa000]/60 hover:bg-[#daa000] hover:text-black"
                    onClick={() => {
                      const index = snapshot.team.length;
                      updateSnapshot({
                        team: [
                          ...snapshot.team,
                          {
                            name: "New member",
                            role: "Member",
                            roles: ["Member"],
                            section: "member",
                            level: "member",
                            order: snapshot.team.length * 10 + 10,
                            active: true,
                          },
                        ],
                      });
                      setTeamQuery("");
                      setTeamSectionFilter("all");
                      setTeamStatusFilter("all");
                      jumpToEntry("team", index);
                    }}
                  >
                    + Add member
                  </button>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
                  <label className={labelClass}>
                    Search people, roles, links
                    <input
                      className={fieldClass}
                      placeholder="Try president, committee, github, name…"
                      value={teamQuery}
                      onChange={(event) => setTeamQuery(event.target.value)}
                    />
                  </label>
                  <label className={labelClass}>
                    Section
                    <select
                      className={fieldClass}
                      value={teamSectionFilter}
                      onChange={(event) =>
                        setTeamSectionFilter(
                          event.target.value as TeamSection | "all",
                        )
                      }
                    >
                      <option value="all">All sections</option>
                      {(Object.keys(teamSectionLabels) as TeamSection[]).map(
                        (section) => (
                          <option key={section} value={section}>
                            {teamSectionLabels[section]}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                  <label className={labelClass}>
                    Status
                    <select
                      className={fieldClass}
                      value={teamStatusFilter}
                      onChange={(event) =>
                        setTeamStatusFilter(
                          event.target.value as TeamStatusFilter,
                        )
                      }
                    >
                      {teamStatusOptions.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption === "all"
                            ? "All statuses"
                            : statusOption}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="self-end border border-white/10 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#aaa398] transition hover:border-white/30 hover:text-[#f3efe6]"
                    onClick={() => {
                      setTeamQuery("");
                      setTeamSectionFilter("all");
                      setTeamStatusFilter("all");
                    }}
                  >
                    Clear
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(Object.keys(teamSectionLabels) as TeamSection[]).map(
                    (section) => (
                      <button
                        key={section}
                        className={`border px-3 py-2 text-left font-mono text-[0.62rem] uppercase tracking-[0.14em] transition ${teamSectionFilter === section ? "border-[#daa000] bg-[#daa000] text-black" : "border-white/10 text-[#aaa398] hover:border-[#daa000]/60 hover:text-[#f3efe6]"}`}
                        onClick={() =>
                          setTeamSectionFilter(
                            teamSectionFilter === section ? "all" : section,
                          )
                        }
                      >
                        {teamSectionLabels[section]}{" "}
                        <span className="ml-1 opacity-70">
                          {teamSectionCounts[section]}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </section>

              {visibleTeamEntries.map(({ member, index }) => (
                <article
                  key={`team-${index}`}
                  data-cms-team-index={index}
                  className={panelClass}
                >
                  <div className="mb-4 flex flex-col gap-2 border-b border-white/10 pb-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#daa000]">
                        {teamSectionLabels[member.section]} · #{index + 1}
                      </p>
                      <h3 className="mt-1 text-lg font-medium tracking-[-0.03em]">
                        {member.name || "Unnamed member"}
                      </h3>
                    </div>
                    <button
                      className="w-fit text-xs text-red-300 underline"
                      onClick={() =>
                        updateSnapshot({
                          team: snapshot.team.filter((_, i) => i !== index),
                        })
                      }
                    >
                      Remove member
                    </button>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-4">
                    <label className={labelClass}>
                      Name
                      <input
                        className={fieldClass}
                        value={member.name}
                        onChange={(event) =>
                          updateSnapshot({
                            team: snapshot.team.map((entry, i) =>
                              i === index
                                ? { ...entry, name: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Primary role
                      <input
                        className={fieldClass}
                        value={member.role || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            team: snapshot.team.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    role: event.target.value,
                                    roles: entry.roles.length
                                      ? entry.roles
                                      : [event.target.value].filter(Boolean),
                                  }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Roles
                      <input
                        className={fieldClass}
                        value={csv(member.roles || [])}
                        onChange={(event) =>
                          updateSnapshot({
                            team: snapshot.team.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    roles: csvToArray(event.target.value),
                                    role:
                                      entry.role ||
                                      csvToArray(event.target.value)[0] ||
                                      "Member",
                                  }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Section
                      <select
                        className={fieldClass}
                        value={member.section}
                        onChange={(event) =>
                          updateSnapshot({
                            team: snapshot.team.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    section: event.target.value as TeamSection,
                                  }
                                : entry,
                            ),
                          })
                        }
                      >
                        <option value="exec">exec</option>
                        <option value="committee">committee</option>
                        <option value="pm">pm</option>
                        <option value="member">member</option>
                      </select>
                    </label>
                    <label className={labelClass}>
                      Level
                      <select
                        className={fieldClass}
                        value={member.level}
                        onChange={(event) =>
                          updateSnapshot({
                            team: snapshot.team.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    level: event.target
                                      .value as TeamMemberContent["level"],
                                  }
                                : entry,
                            ),
                          })
                        }
                      >
                        <option value="exec">exec</option>
                        <option value="pm">pm</option>
                        <option value="admin">admin</option>
                        <option value="member">member</option>
                      </select>
                    </label>
                    <label className={labelClass}>
                      Order
                      <input
                        className={fieldClass}
                        type="number"
                        value={member.order}
                        onChange={(event) =>
                          updateSnapshot({
                            team: snapshot.team.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    order: Number(event.target.value),
                                  }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Email
                      <input
                        className={fieldClass}
                        value={member.email || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            team: snapshot.team.map((entry, i) =>
                              i === index
                                ? { ...entry, email: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      LinkedIn
                      <input
                        className={fieldClass}
                        value={member.linkedin || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            team: snapshot.team.map((entry, i) =>
                              i === index
                                ? { ...entry, linkedin: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      GitHub
                      <input
                        className={fieldClass}
                        value={member.github || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            team: snapshot.team.map((entry, i) =>
                              i === index
                                ? { ...entry, github: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Photo path
                      <input
                        className={fieldClass}
                        value={member.image || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            team: snapshot.team.map((entry, i) =>
                              i === index
                                ? { ...entry, image: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Upload photo
                      <span className={fileButtonClass}>Choose file</span>
                      <input
                        className="sr-only"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          const renamed = new File(
                            [file],
                            `${slugify(member.name || `member-${index + 1}`)}.${extensionFor(file)}`,
                            { type: file.type },
                          );
                          void attachAsset(
                            renamed,
                            "public/team",
                            "/team",
                            (path) =>
                              updateSnapshot({
                                team: snapshot.team.map((entry, i) =>
                                  i === index
                                    ? { ...entry, image: path }
                                    : entry,
                                ),
                              }),
                          );
                        }}
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[#aaa398]">
                      <input
                        type="checkbox"
                        checked={member.active}
                        onChange={(event) =>
                          updateSnapshot({
                            team: snapshot.team.map((entry, i) =>
                              i === index
                                ? { ...entry, active: event.target.checked }
                                : entry,
                            ),
                          })
                        }
                      />{" "}
                      Active
                    </label>
                  </div>
                </article>
              ))}
            </div>
          )}
          {tab === "workshops" && (
            <div className="space-y-4">
              <button
                className="border border-white/10 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#daa000]"
                onClick={() => {
                  const index = snapshot.workshops.length;
                  updateSnapshot({
                    workshops: [
                      ...snapshot.workshops,
                      {
                        slug: "new-workshop",
                        title: "New workshop",
                        tags: [],
                        body: "",
                      },
                    ],
                  });
                  jumpToEntry("workshop", index);
                }}
              >
                + Add workshop
              </button>
              {snapshot.workshops.map((workshop, index) => (
                <article
                  key={`workshop-${index}`}
                  data-cms-workshop-index={index}
                  className={panelClass}
                >
                  <div className="grid gap-3 lg:grid-cols-3">
                    <label className={labelClass}>
                      Title
                      <input
                        className={fieldClass}
                        value={workshop.title}
                        onChange={(event) =>
                          updateSnapshot({
                            workshops: snapshot.workshops.map((entry, i) =>
                              i === index
                                ? { ...entry, title: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Slug
                      <input
                        className={fieldClass}
                        value={workshop.slug}
                        onChange={(event) =>
                          updateSnapshot({
                            workshops: snapshot.workshops.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    slug: slugify(event.target.value),
                                  }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Date
                      <input
                        className={fieldClass}
                        type="date"
                        value={workshop.date || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            workshops: snapshot.workshops.map((entry, i) =>
                              i === index
                                ? { ...entry, date: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Location
                      <input
                        className={fieldClass}
                        value={workshop.location || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            workshops: snapshot.workshops.map((entry, i) =>
                              i === index
                                ? { ...entry, location: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Tags
                      <input
                        className={fieldClass}
                        value={csv(workshop.tags || [])}
                        onChange={(event) =>
                          updateSnapshot({
                            workshops: snapshot.workshops.map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    tags: csvToArray(event.target.value),
                                  }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Cover
                      <input
                        className={fieldClass}
                        value={workshop.cover || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            workshops: snapshot.workshops.map((entry, i) =>
                              i === index
                                ? { ...entry, cover: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className={`${labelClass} lg:col-span-3`}>
                      Summary
                      <textarea
                        className={`${fieldClass} min-h-20`}
                        value={workshop.summary || ""}
                        onChange={(event) =>
                          updateSnapshot({
                            workshops: snapshot.workshops.map((entry, i) =>
                              i === index
                                ? { ...entry, summary: event.target.value }
                                : entry,
                            ),
                          })
                        }
                      />
                    </label>
                    <details className="lg:col-span-3 border border-white/10 bg-black/25">
                      <summary className="flex cursor-pointer items-center justify-between gap-3 px-3 py-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#daa000]">
                        <span>Edit MDX body</span>
                        <span className="text-[#8d867b]">
                          {workshop.body.trim()
                            ? `${workshop.body.trim().split(/\s+/).length} words`
                            : "empty"}
                        </span>
                      </summary>
                      <div className="border-t border-white/10 p-3">
                        <p className="mb-3 text-xs leading-5 text-[#8d867b]">
                          Long-form workshop copy is collapsed so the main form
                          stays scannable. Open this only when you need to edit
                          the page body.
                        </p>
                        <textarea
                          className={`${fieldClass} min-h-[24rem] font-mono leading-6`}
                          value={workshop.body}
                          onChange={(event) =>
                            updateSnapshot({
                              workshops: snapshot.workshops.map((entry, i) =>
                                i === index
                                  ? { ...entry, body: event.target.value }
                                  : entry,
                              ),
                            })
                          }
                        />
                      </div>
                    </details>
                    <label className={labelClass}>
                      Upload cover/file
                      <span className={fileButtonClass}>Choose file</span>
                      <input
                        className="sr-only"
                        type="file"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file)
                            void attachAsset(
                              file,
                              `public/workshops/${workshop.slug}`,
                              `/workshops/${workshop.slug}`,
                              (path) =>
                                updateSnapshot({
                                  workshops: snapshot.workshops.map(
                                    (entry, i) =>
                                      i === index
                                        ? {
                                            ...entry,
                                            cover: entry.cover || path,
                                          }
                                        : entry,
                                  ),
                                }),
                            );
                        }}
                      />
                    </label>
                  </div>
                  <button
                    className="mt-3 text-xs text-red-300 underline"
                    onClick={() =>
                      updateSnapshot({
                        workshops: snapshot.workshops.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                  >
                    Remove workshop
                  </button>
                </article>
              ))}
            </div>
          )}
          {tab === "preview" && (
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                ["Projects", snapshot.projects.length],
                [
                  "Active team",
                  snapshot.team.filter((member) => member.active).length,
                ],
                ["Workshops", snapshot.workshops.length],
              ].map(([label, count]) => (
                <article key={String(label)} className={panelClass}>
                  <h2 className="text-xl font-medium tracking-[-0.04em]">
                    {label}
                  </h2>
                  <p className="mt-2 text-sm text-[#8d867b]">
                    {count} entries in this draft.
                  </p>
                </article>
              ))}
            </div>
          )}
          {tab === "assets" && (
            <div className={panelClass}>
              <h2 className="text-xl font-medium tracking-[-0.04em]">
                Pending uploads
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-[#aaa398]">
                {assets.map((asset) => (
                  <li
                    key={asset.path}
                    className="flex items-center justify-between border border-white/10 px-3 py-2"
                  >
                    <span>{asset.path}</span>
                    <button
                      className="text-red-300 underline"
                      onClick={() =>
                        setAssets((current) =>
                          current.filter((entry) => entry.path !== asset.path),
                        )
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {assets.length === 0 && <li>No pending uploads.</li>}
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

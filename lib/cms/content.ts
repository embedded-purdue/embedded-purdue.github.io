import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cmsSnapshotSchema, PROJECTS_PATH, projectSchema, TEAM_PATH, teamMemberSchema, WORKSHOPS_DIR, workshopSchema, type CmsPublishPayload, type CmsSnapshot, type ProjectContent, type TeamMemberContent, type WorkshopContent } from "./schema";

const root = process.cwd();

async function readJsonFile<T>(relativePath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8")) as T;
  } catch {
    return fallback;
  }
}

function splitProjectManagers(value: string | undefined) {
  return (value || "").replace(/^PMs?:\s*/i, "").split(/[,\n]+/).map((entry) => entry.trim()).filter(Boolean);
}

function normalizeProject(entry: unknown): ProjectContent {
  const parsed = projectSchema.parse(entry);
  const pms = parsed.pms.length ? parsed.pms : splitProjectManagers(parsed.pm);
  return { ...parsed, pms, pm: pms.join(", ") };
}

export async function readProjectsContent(): Promise<ProjectContent[]> {
  const raw = await readJsonFile<unknown[]>(PROJECTS_PATH, []);
  return raw.map(normalizeProject);
}

export async function readTeamContent(): Promise<TeamMemberContent[]> {
  const raw = await readJsonFile<unknown[]>(TEAM_PATH, []);
  return raw.map((entry) => teamMemberSchema.parse(entry)).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export async function readWorkshopsContent(): Promise<WorkshopContent[]> {
  const dir = path.join(root, WORKSHOPS_DIR);
  let files: string[] = [];
  try { files = await fs.readdir(dir); } catch { return []; }

  const workshops: WorkshopContent[] = [];
  for (const file of files) {
    if (!/\.mdx?$/i.test(file)) continue;
    const parsed = matter(await fs.readFile(path.join(dir, file), "utf8"));
    const data = parsed.data ?? {};
    const slug = String(data.slug ?? file.replace(/\.mdx?$/i, ""));
    workshops.push(workshopSchema.parse({
      slug,
      title: String(data.title ?? slug),
      date: data.date ? String(data.date) : "",
      location: data.location ? String(data.location) : "",
      summary: data.summary ? String(data.summary) : data.description ? String(data.description) : "",
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      cover: data.cover ? String(data.cover) : data.image ? String(data.image) : "",
      body: parsed.content.trim(),
    }));
  }
  return workshops.sort((a, b) => (a.date && b.date ? b.date.localeCompare(a.date) : a.title.localeCompare(b.title)));
}

export async function readCmsSnapshot(baseBranch: string, baseCommitSha: string | null): Promise<CmsSnapshot> {
  return cmsSnapshotSchema.parse({ baseBranch, baseCommitSha, projects: await readProjectsContent(), team: await readTeamContent(), workshops: await readWorkshopsContent() });
}

function cleanOptional<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== "")) as T;
}

function stringifyWorkshop(workshop: WorkshopContent) {
  return matter.stringify(`${workshop.body.trim()}\n`, cleanOptional({
    title: workshop.title,
    slug: workshop.slug,
    date: workshop.date,
    location: workshop.location,
    summary: workshop.summary,
    tags: workshop.tags.length ? workshop.tags : undefined,
    cover: workshop.cover,
  }));
}

export function buildCmsFiles(payload: CmsPublishPayload): Array<{ path: string; content: string; encoding?: "utf-8" | "base64" }> {
  const files: Array<{ path: string; content: string; encoding?: "utf-8" | "base64" }> = [
    { path: PROJECTS_PATH, content: `${JSON.stringify(payload.projects.map(normalizeProject), null, 2)}\n`, encoding: "utf-8" },
    { path: TEAM_PATH, content: `${JSON.stringify(payload.team.map((entry) => teamMemberSchema.parse(entry)), null, 2)}\n`, encoding: "utf-8" },
  ];
  for (const workshop of payload.workshops.map((entry) => workshopSchema.parse(entry))) {
    files.push({ path: `${WORKSHOPS_DIR}/${workshop.slug}.md`, content: stringifyWorkshop(workshop), encoding: "utf-8" });
  }
  for (const asset of payload.assets) files.push({ path: asset.path, content: asset.contentBase64, encoding: "base64" });
  return files;
}

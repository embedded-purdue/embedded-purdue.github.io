import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  cmsSnapshotSchema,
  PROJECTS_PATH,
  TEAM_PATH,
  teamMemberSchema,
  WORKSHOPS_DIR,
  workshopSchema,
  type CmsSnapshot,
  type ProjectContent,
  type TeamMemberContent,
  type WorkshopContent,
} from "./schema";
import { normalizeProject } from "./normalize";

const root = process.cwd();

async function readJsonFile<T>(relativePath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(
      await fs.readFile(path.join(root, relativePath), "utf8"),
    ) as T;
  } catch {
    return fallback;
  }
}

export async function readProjectsContent(): Promise<ProjectContent[]> {
  const raw = await readJsonFile<unknown[]>(PROJECTS_PATH, []);
  return raw.map(normalizeProject);
}

export async function readTeamContent(): Promise<TeamMemberContent[]> {
  const raw = await readJsonFile<unknown[]>(TEAM_PATH, []);
  return raw
    .map((entry) => teamMemberSchema.parse(entry))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export async function readWorkshopsContent(): Promise<WorkshopContent[]> {
  const dir = path.join(root, WORKSHOPS_DIR);
  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const workshops: WorkshopContent[] = [];
  for (const file of files) {
    if (!/\.mdx?$/i.test(file)) continue;
    const parsed = matter(await fs.readFile(path.join(dir, file), "utf8"));
    const data = parsed.data ?? {};
    const slug = String(data.slug ?? file.replace(/\.mdx?$/i, ""));
    workshops.push(
      workshopSchema.parse({
        slug,
        title: String(data.title ?? slug),
        date: data.date ? String(data.date) : "",
        location: data.location ? String(data.location) : "",
        summary: data.summary
          ? String(data.summary)
          : data.description
            ? String(data.description)
            : "",
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        cover: data.cover
          ? String(data.cover)
          : data.image
            ? String(data.image)
            : "",
        body: parsed.content.trim(),
      }),
    );
  }
  return workshops.sort((a, b) =>
    a.date && b.date
      ? b.date.localeCompare(a.date)
      : a.title.localeCompare(b.title),
  );
}

export async function readCmsSnapshot(
  baseBranch: string,
  baseCommitSha: string | null,
): Promise<CmsSnapshot> {
  return cmsSnapshotSchema.parse({
    baseBranch,
    baseCommitSha,
    projects: await readProjectsContent(),
    team: await readTeamContent(),
    workshops: await readWorkshopsContent(),
  });
}

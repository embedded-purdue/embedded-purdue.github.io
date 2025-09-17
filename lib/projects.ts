// /lib/projects.ts
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type ProjectMeta = {
  title: string;
  slug: string;
  summary?: string;
  semester?: string;
  date?: string;
  location?: string;
  tags?: string[];
  repoUrl?: string;
  // you can add more fields freely
  [key: string]: unknown;
};

export type ProjectPostMeta = {
  title: string;
  slug: string;
  date?: string;
  summary?: string;
  [key: string]: unknown;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "projects");
const PUBLIC_MEDIA_ROOT = path.join(process.cwd(), "public", "projects");

// ---------- internal helpers ----------
async function readMarkdown(slug: string) {
  const filePath = path.join(CONTENT_ROOT, slug, "index.md");
  const file = await fs.readFile(filePath, "utf8");
  return file;
}

async function safeStat(p: string) {
  try {
    return await fs.stat(p);
  } catch {
    return null;
  }
}

function publicUrlFromAbsolute(absPath: string) {
  // convert "/.../public/projects/foo/img.jpg" -> "/projects/foo/img.jpg"
  const idx = absPath.lastIndexOf(path.join("public", "projects"));
  if (idx === -1) return "";
  return "/" + absPath.slice(idx + "public/".length).replace(/\\/g, "/");
}

// ---------- existing loaders ----------
export async function loadMarkdown(slug: string): Promise<string | null> {
  try {
    const raw = await readMarkdown(slug);
    const parsed = matter(raw);
    return parsed.content.trim();
  } catch {
    return null;
  }
}

export async function loadMeta(slug: string): Promise<ProjectMeta | null> {
  try {
    const raw = await readMarkdown(slug);
    const parsed = matter(raw);
    const data = parsed.data ?? {};
    return {
      slug,
      title: String(data.title ?? slug),
      summary: data.summary ? String(data.summary) : undefined,
      semester: data.semester ? String(data.semester) : undefined,
      date: data.date ? String(data.date) : undefined,
      location: data.location ? String(data.location) : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
      repoUrl: data.repoUrl ? String(data.repoUrl) : undefined,
      ...data,
    };
  } catch {
    return null;
  }
}

export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const dirs = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
    const slugs: string[] = [];
    for (const d of dirs) {
      if (!d.isDirectory()) continue;
      const mdPath = path.join(CONTENT_ROOT, d.name, "index.md");
      try {
        await fs.access(mdPath);
        slugs.push(d.name);
      } catch {
        /* skip */
      }
    }
    return slugs.sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

// ---------- NEW: project media ----------
export async function getProjectMedia(slug: string): Promise<{ images: string[]; videos: string[] }> {
  // Store media in public/projects/<slug>/...
  const base = path.join(PUBLIC_MEDIA_ROOT, slug);
  const st = await safeStat(base);
  if (!st || !st.isDirectory()) return { images: [], videos: [] };

  const files = await fs.readdir(base);
  const images: string[] = [];
  const videos: string[] = [];

  const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
  const VIDEO_EXT = new Set([".mp4", ".webm"]);
  // Also allow a file "videos.txt" with one iframe URL per line (e.g., YouTube embeds)
  const URL_LIST_FILE = "videos.txt";

  for (const f of files) {
    const abs = path.join(base, f);
    const stat = await safeStat(abs);
    if (!stat?.isFile()) continue;

    const ext = path.extname(f).toLowerCase();
    if (IMAGE_EXT.has(ext)) {
      images.push(publicUrlFromAbsolute(abs));
    } else if (VIDEO_EXT.has(ext)) {
      videos.push(publicUrlFromAbsolute(abs));
    } else if (f === URL_LIST_FILE) {
      // read URLs (YouTube/Vimeo iframes)
      const txt = await fs.readFile(abs, "utf8");
      for (const line of txt.split(/\r?\n/)) {
        const url = line.trim();
        if (!url) continue;
        videos.push(url);
      }
    }
  }

  // dedupe + sort for stability
  const uniq = (arr: string[]) => Array.from(new Set(arr));
  return {
    images: uniq(images).sort(),
    videos: uniq(videos).sort(),
  };
}

// ---------- NEW: project posts (markdown) ----------
export async function getProjectPosts(slug: string): Promise<ProjectPostMeta[]> {
  // content/projects/<slug>/posts/<post>.md
  const postsDir = path.join(CONTENT_ROOT, slug, "posts");
  const st = await safeStat(postsDir);
  if (!st || !st.isDirectory()) return [];

  const files = await fs.readdir(postsDir);
  const out: ProjectPostMeta[] = [];

  for (const f of files) {
    if (!f.endsWith(".md")) continue;
    const raw = await fs.readFile(path.join(postsDir, f), "utf8");
    const parsed = matter(raw);
    const data = parsed.data ?? {};
    const postSlug = f.replace(/\.md$/, "");

    out.push({
      slug: postSlug,
      title: String(data.title ?? postSlug),
      date: data.date ? String(data.date) : undefined,
      summary: data.summary ? String(data.summary) : undefined,
      ...data,
    });
  }

  // newest first if dates present
  out.sort((a, b) => {
    const da = a.date ? Date.parse(a.date) : 0;
    const db = b.date ? Date.parse(b.date) : 0;
    return db - da;
  });

  return out;
}

export async function loadPost(
  slug: string,
  post: string
): Promise<{ meta: Record<string, unknown>; content: string } | null> {
  try {
    const filePath = path.join(CONTENT_ROOT, slug, "posts", `${post}.md`);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    return {
      meta: parsed.data ?? {},
      content: (parsed.content ?? "").trim(),
    };
  } catch {
    return null;
  }
}
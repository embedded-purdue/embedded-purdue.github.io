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

const CONTENT_ROOT = path.join(process.cwd(), "public", "projects");
const PUBLIC_MEDIA_ROOT = path.join(process.cwd(), "public", "projects");

// ---------- internal helpers ----------
async function safeStat(p: string) {
  try {
    return await fs.stat(p);
  } catch {
    return null;
  }
}

async function safeReadFile(p: string) {
  try {
    return await fs.readFile(p, "utf8");
  } catch {
    return null;
  }
}

async function readIndexFile(slug: string): Promise<{ filePath: string; src: string } | null> {
  // try index.md, then index.mdx
  const md = path.join(CONTENT_ROOT, slug, "index.md");
  const mdx = path.join(CONTENT_ROOT, slug, "index.mdx");

  const mdSrc = await safeReadFile(md);
  if (mdSrc !== null) return { filePath: md, src: mdSrc };

  const mdxSrc = await safeReadFile(mdx);
  if (mdxSrc !== null) return { filePath: mdx, src: mdxSrc };

  return null;
}

function publicUrlFromAbsolute(absPath: string) {
  // convert "/.../public/projects/foo/img.jpg" -> "/projects/foo/img.jpg"
  const marker = path.join("public", "projects");
  const idx = absPath.lastIndexOf(marker);
  if (idx === -1) return "";
  // slice starting right after "public/"
  const start = idx + "public/".length;
  return "/" + absPath.slice(start).replace(/\\/g, "/");
}

// ---------- existing loaders ----------
export async function loadMarkdown(slug: string): Promise<string | null> {
  const file = await readIndexFile(slug);
  if (!file) return null;
  const parsed = matter(file.src);
  return (parsed.content ?? "").trim();
}

export async function loadMeta(slug: string): Promise<ProjectMeta | null> {
  const file = await readIndexFile(slug);
  if (!file) return null;
  const parsed = matter(file.src);
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
}

/**
 * Return all slugs that should exist as project pages.
 * A slug is included if:
 *  - `content/projects/<slug>/index.md(x)` exists, OR
 *  - there is at least one post under `content/projects/<slug>/posts/*.md(x)`
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const dirStat = await safeStat(CONTENT_ROOT);
  if (!dirStat?.isDirectory()) return [];

  const entries = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  const slugs: string[] = [];

  for (const d of entries) {
    if (!d.isDirectory()) continue;
    const slug = d.name;

    // Check for index.md(x)
    const hasIndex =
      (await safeStat(path.join(CONTENT_ROOT, slug, "index.md")))?.isFile() ||
      (await safeStat(path.join(CONTENT_ROOT, slug, "index.mdx")))?.isFile();

    if (hasIndex) {
      slugs.push(slug);
      continue;
    }

    // Otherwise, include if there are any posts
    const postsDir = path.join(CONTENT_ROOT, slug, "posts");
    const postsStat = await safeStat(postsDir);
    if (!postsStat?.isDirectory()) continue;

    const postFiles = await fs.readdir(postsDir);
    const hasAnyPost = postFiles.some((f) => /\.mdx?$/.test(f));
    if (hasAnyPost) slugs.push(slug);
  }

  return slugs.sort((a, b) => a.localeCompare(b));
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
      const txt = await safeReadFile(abs);
      if (txt) {
        for (const line of txt.split(/\r?\n/)) {
          const url = line.trim();
          if (!url) continue;
          videos.push(url);
        }
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
  // content/projects/<slug>/posts/<post>.md(x)
  const postsDir = path.join(CONTENT_ROOT, slug, "posts");
  const st = await safeStat(postsDir);
  if (!st || !st.isDirectory()) return [];

  const files = await fs.readdir(postsDir);
  const out: ProjectPostMeta[] = [];

  for (const f of files) {
    if (!/\.mdx?$/.test(f)) continue; // accept .md and .mdx

    const src = await safeReadFile(path.join(postsDir, f));
    if (src === null) continue;

    const parsed = matter(src);
    const data = parsed.data ?? {};
    const postSlug = f.replace(/\.mdx?$/, "");

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
  // Try <post>.md, then <post>.mdx
  const md = path.join(CONTENT_ROOT, slug, "posts", `${post}.md`);
  const mdx = path.join(CONTENT_ROOT, slug, "posts", `${post}.mdx`);

  const mdSrc = await safeReadFile(md);
  const src = mdSrc ?? (await safeReadFile(mdx));
  if (src === null) return null;

  const parsed = matter(src);
  return {
    meta: parsed.data ?? {},
    content: (parsed.content ?? "").trim(),
  };
}
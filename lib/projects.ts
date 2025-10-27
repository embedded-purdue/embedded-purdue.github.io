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
  // try index.md/x, then README.md/x (common in repos)
  const candidates = [
    path.join(CONTENT_ROOT, slug, "index.md"),
    path.join(CONTENT_ROOT, slug, "index.mdx"),
    path.join(CONTENT_ROOT, slug, "README.md"),
    path.join(CONTENT_ROOT, slug, "README.mdx"),
  ];
  for (const fp of candidates) {
    const src = await safeReadFile(fp);
    if (src !== null) return { filePath: fp, src };
  }
  return null;
}

// Read all additional markdown files under the project root and optional "pages" subfolder,
// excluding the primary README/index and the posts directory.
export async function getAdditionalMarkdown(
  slug: string
): Promise<Array<{ file: string; title: string; order?: number; content: string }>> {
  const base = path.join(CONTENT_ROOT, slug);
  const st = await safeStat(base);
  if (!st?.isDirectory()) return [];

  const isMd = (f: string) => /\.(md|mdx)$/i.test(f);
  const excludeNames = new Set(["index.md", "index.mdx", "README.md", "README.mdx"]);

  async function collectFrom(dir: string) {
    const items: Array<{ file: string; title: string; order?: number; content: string }> = [];
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of list) {
      if (!ent.isFile()) continue;
      const name = ent.name;
      if (!isMd(name)) continue;
      if (dir === base && excludeNames.has(name)) continue; // primary file
      const abs = path.join(dir, name);
      const src = await safeReadFile(abs);
      if (!src) continue;
      const parsed = matter(src);
      const data = parsed.data ?? {};
      const title = String(data.title ?? name.replace(/\.(md|mdx)$/i, "").replace(/[-_]/g, " "));
      const order = typeof data.order === "number" ? data.order : undefined;
      items.push({ file: abs, title, order, content: (parsed.content ?? "").trim() });
    }
    return items;
  }

  const pagesDir = path.join(base, "pages");
  const pagesSt = await safeStat(pagesDir);
  const fromRoot = await collectFrom(base);
  const fromPages = pagesSt?.isDirectory() ? await collectFrom(pagesDir) : [];

  const all = [...fromRoot, ...fromPages];
  // sort by explicit order then by filename
  all.sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9) || a.file.localeCompare(b.file));
  return all;
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
    const hasAnyPost = postFiles.some((f) => /\.mdx?$/i.test(f));
    if (hasAnyPost) {
      slugs.push(slug);
      continue;
    }

    // As a fallback, include if there are any additional markdown files besides index/README
    const rootFiles = await fs.readdir(path.join(CONTENT_ROOT, slug));
    const hasAnyExtraMd = rootFiles.some((f) => /\.(md|mdx)$/i.test(f) && !["index.md", "index.mdx", "README.md", "README.mdx"].includes(f));
    if (hasAnyExtraMd) slugs.push(slug);
  }

  return slugs.sort((a, b) => a.localeCompare(b));
}

// ---------- NEW: project media ----------
export async function getProjectMedia(
  slug: string
): Promise<{
  images: string[];
  videos: string[];
  docs: string[];
  files: Array<{
    url: string;
    name: string;
    ext: string;
    kind: "code" | "data" | "html" | "other";
    language?: string;
    content?: string; // Small preview for text files
  }>;
}> {
  // Store media in public/projects/<slug>/...
  const base = path.join(PUBLIC_MEDIA_ROOT, slug);
  const st = await safeStat(base);
  if (!st || !st.isDirectory()) return { images: [], videos: [], docs: [], files: [] };
  // Recursively walk files, skipping markdown-focused folders
  const skipDirs = new Set(["posts", "pages"]);
  async function walk(dir: string, acc: string[] = []): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (skipDirs.has(e.name)) continue;
        await walk(abs, acc);
      } else if (e.isFile()) {
        acc.push(abs);
      }
    }
    return acc;
  }
  const files = await walk(base);
  const images: string[] = [];
  const videos: string[] = [];
  const docs: string[] = [];
  const filesOut: Array<{
    url: string;
    name: string;
    ext: string;
    kind: "code" | "data" | "html" | "other";
    language?: string;
    content?: string;
  }> = [];

  const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
  const VIDEO_EXT = new Set([".mp4", ".webm"]);
  const DOC_EXT = new Set([".pdf"]);
  const HTML_EXT = new Set([".html", ".htm"]);
  const DATA_EXT = new Set([".csv", ".txt", ".log"]);
  const CODE_EXT = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".yml",
    ".yaml",
    ".toml",
    ".md",
    ".mdx",
    ".py",
    ".c",
    ".h",
    ".cpp",
    ".hpp",
    ".ino",
    ".rs",
    ".go",
    ".java",
    ".kt",
    ".swift",
    ".sh",
    ".bash",
    ".zsh",
    ".css",
    ".scss",
    ".html",
  ]);
  const MAX_PREVIEW_BYTES = 200 * 1024; // 200KB

  const langFromExt: Record<string, string> = {
    ".ts": "ts",
    ".tsx": "tsx",
    ".js": "js",
    ".jsx": "jsx",
    ".json": "json",
    ".yml": "yaml",
    ".yaml": "yaml",
    ".toml": "toml",
    ".md": "markdown",
    ".mdx": "markdown",
    ".py": "python",
    ".c": "c",
    ".h": "c",
    ".cpp": "cpp",
    ".hpp": "cpp",
    ".ino": "cpp",
    ".rs": "rust",
    ".go": "go",
    ".java": "java",
    ".kt": "kotlin",
    ".swift": "swift",
    ".sh": "bash",
    ".bash": "bash",
    ".zsh": "bash",
    ".css": "css",
    ".scss": "scss",
    ".html": "html",
    ".csv": "csv",
    ".txt": "text",
    ".log": "text",
  };
  // Also allow a file "videos.txt" with one iframe URL per line (e.g., YouTube embeds)
  const URL_LIST_FILE = "videos.txt";
  // And a file listing external document links (one per line)
  const DOC_URL_LIST_FILE = "docs.txt";

  for (const abs of files) {
    const f = path.basename(abs);
    const ext = path.extname(f).toLowerCase();
    if (IMAGE_EXT.has(ext)) {
      images.push(publicUrlFromAbsolute(abs));
    } else if (VIDEO_EXT.has(ext)) {
      videos.push(publicUrlFromAbsolute(abs));
    } else if (DOC_EXT.has(ext)) {
      docs.push(publicUrlFromAbsolute(abs));
    } else if (HTML_EXT.has(ext)) {
      filesOut.push({
        url: publicUrlFromAbsolute(abs),
        name: f,
        ext,
        kind: "html",
        language: "html",
      });
    } else if (CODE_EXT.has(ext) || DATA_EXT.has(ext)) {
      // Try to include a small preview for text-like files
      let content: string | undefined;
      try {
        const buf = await fs.readFile(abs);
        if (buf.byteLength <= MAX_PREVIEW_BYTES) {
          content = buf.toString("utf8");
        }
      } catch {
        // ignore
      }
      filesOut.push({
        url: publicUrlFromAbsolute(abs),
        name: f,
        ext,
        kind: DATA_EXT.has(ext) ? "data" : CODE_EXT.has(ext) ? "code" : "other",
        language: langFromExt[ext],
        content,
      });
    } else if (f === URL_LIST_FILE) {
      const txt = await safeReadFile(abs);
      if (txt) {
        for (const line of txt.split(/\r?\n/)) {
          const url = line.trim();
          if (!url) continue;
          videos.push(url);
        }
      }
    } else if (f === DOC_URL_LIST_FILE) {
      const txt = await safeReadFile(abs);
      if (txt) {
        for (const line of txt.split(/\r?\n/)) {
          const url = line.trim();
          if (!url) continue;
          docs.push(url);
        }
      }
    }
  }

  // dedupe + sort for stability
  const uniq = (arr: string[]) => Array.from(new Set(arr));
  return {
    images: uniq(images).sort(),
    videos: uniq(videos).sort(),
    docs: uniq(docs).sort(),
    files: filesOut,
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
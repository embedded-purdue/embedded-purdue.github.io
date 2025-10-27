// lib/media.ts - Unified media fetching (API + local fallback)
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export type MediaItem = {
  id: string;
  kind: "project" | "workshop" | "other";
  title: string;
  description?: string;
  files: MediaFile[];
  markdownFiles: MediaFile[];
  createdAt: string;
  slug?: string; // derived from title for local compat
};

export type MediaFile = {
  url: string;
  name: string;
  type: string;
  size: number;
};

// Fetch media from API
export async function getMediaFromAPI(
  kind?: "project" | "workshop" | "other",
  onlyMarkdown = false
): Promise<MediaItem[]> {
  try {
    const params = new URLSearchParams();
    if (kind) params.set("kind", kind);
    if (onlyMarkdown) params.set("only", "markdown");
    
    const url = `${API_BASE}/api/media${params.toString() ? `?${params}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) {
      console.warn(`API fetch failed: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    const items = data.items || [];
    
    // Add slug field for consistency
    return items.map((item: MediaItem) => ({
      ...item,
      slug: item.slug || slugify(item.title),
    }));
  } catch (err) {
    console.warn("Failed to fetch from API:", err);
    return [];
  }
}

// Fetch local projects as fallback
export function getLocalProjects(): MediaItem[] {
  const projectsDir = path.join(process.cwd(), "public", "projects");
  
  if (!fs.existsSync(projectsDir)) return [];
  
  const items: MediaItem[] = [];
  const folders = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(d => d.isDirectory());
  
  for (const folder of folders) {
    const slug = folder.name;
    const folderPath = path.join(projectsDir, slug);
    
    // Look for index.md or README.md
    const indexPath = path.join(folderPath, "index.md");
    const readmePath = path.join(folderPath, "README.md");
    
    let mdPath: string | null = null;
    if (fs.existsSync(indexPath)) mdPath = indexPath;
    else if (fs.existsSync(readmePath)) mdPath = readmePath;
    
    if (!mdPath) continue;
    
    const content = fs.readFileSync(mdPath, "utf8");
    const { data } = matter(content);
    
    // Collect images
    const files: MediaFile[] = [];
    const allFiles = fs.readdirSync(folderPath);
    
    for (const file of allFiles) {
      const ext = path.extname(file).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(ext)) {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        files.push({
          url: `/projects/${slug}/${file}`,
          name: file,
          type: `image/${ext.slice(1)}`,
          size: stats.size,
        });
      }
    }
    
    // Add markdown file
    const mdFile: MediaFile = {
      url: `/projects/${slug}/${path.basename(mdPath)}`,
      name: path.basename(mdPath),
      type: "text/markdown",
      size: fs.statSync(mdPath).size,
    };
    files.push(mdFile);
    
    items.push({
      id: slug,
      kind: "project",
      title: (data.title as string) || slug,
      description: (data.summary as string) || (data.description as string),
      files,
      markdownFiles: [mdFile],
      createdAt: (data.date as string) || new Date().toISOString(),
      slug,
    });
  }
  
  return items;
}

// Fetch local workshops as fallback
export function getLocalWorkshops(): MediaItem[] {
  const workshopsDir = path.join(process.cwd(), "content", "workshops");
  
  if (!fs.existsSync(workshopsDir)) return [];
  
  const items: MediaItem[] = [];
  const files = fs.readdirSync(workshopsDir)
    .filter(f => f.endsWith(".md") || f.endsWith(".mdx"));
  
  for (const file of files) {
    const filePath = path.join(workshopsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const { data } = matter(content);
    
    const slug = (data.slug as string) || file.replace(/\.(md|mdx)$/, "");
    
    const mdFile: MediaFile = {
      url: `/workshops/${file}`,
      name: file,
      type: "text/markdown",
      size: fs.statSync(filePath).size,
    };
    
    items.push({
      id: slug,
      kind: "workshop",
      title: (data.title as string) || slug,
      description: (data.summary as string) || (data.description as string),
      files: [mdFile],
      markdownFiles: [mdFile],
      createdAt: (data.date as string) || new Date().toISOString(),
      slug,
    });
  }
  
  return items;
}

// Combined: try API first, fallback to local
export async function getAllMedia(kind?: "project" | "workshop" | "other"): Promise<MediaItem[]> {
  const apiItems = await getMediaFromAPI(kind);
  
  if (apiItems.length > 0) {
    return apiItems;
  }
  
  // Fallback to local files
  if (kind === "project") return getLocalProjects();
  if (kind === "workshop") return getLocalWorkshops();
  
  // Return both if no kind specified
  return [...getLocalProjects(), ...getLocalWorkshops()];
}

// Get single media item by slug
export async function getMediaBySlug(slug: string, kind?: "project" | "workshop"): Promise<MediaItem | null> {
  const allItems = await getAllMedia(kind);
  return allItems.find(item => item.slug === slug) || null;
}

// Helper to create URL-safe slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

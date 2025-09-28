// app/projects/[slug]/posts/[post]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  getAllProjectSlugs,
  getProjectPosts,
  loadMeta,
  loadPost,
} from "@/lib/projects";

// --- Tell Next this page is fully static and params are prebuilt
export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;
export const runtime = "nodejs"; // (explicit, avoids edge runtime surprises)

type Params = { slug: string; post: string };

// Build ALL paths at export time. Never throw here.
export async function generateStaticParams(): Promise<Params[]> {
  try {
    const slugs = await getAllProjectSlugs();
    const out: Params[] = [];
    for (const slug of slugs) {
      const posts = await getProjectPosts(slug);
      for (const p of posts) {
        if (p?.slug) out.push({ slug, post: p.slug });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export default async function ProjectPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, post } = await params;

  const meta = await loadMeta(slug);
  if (!meta) return notFound();

  const data = await loadPost(slug, post);
  if (!data) return notFound();

  // Coerce unknown → string for JSX
  const title =
    typeof data.meta.title === "string" && data.meta.title.trim()
      ? data.meta.title
      : post.replace(/[-_]/g, " ");

  const dateStr =
    typeof data.meta.date === "string" && data.meta.date.trim()
      ? new Date(data.meta.date).toLocaleDateString()
      : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Link href={`/projects/${slug}`} className="underline text-sm">
          ← Back to project
        </Link>

        <h1 className="mt-4 text-3xl font-bold">{title}</h1>
        {dateStr ? <p className="text-muted-foreground">{dateStr}</p> : null}

        <article className="mt-6">
          <Markdown imageBase={`/projects/${slug}`}>{data.content}</Markdown>
        </article>
      </main>
      <Footer />
    </div>
  );
}
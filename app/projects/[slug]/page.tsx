// app/projects/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Markdown from "@/components/Markdown";
import {
  loadMeta,
  loadMarkdown,
  getAllProjectSlugs,
  getProjectPosts,
  loadPost,
} from "@/lib/projects";
import { projects as DATA } from "../_data";

export const dynamic = "error";
export const dynamicParams = false;

// Build all project slugs from both content and UI data
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const contentSlugs = await getAllProjectSlugs();
  const dataSlugs = DATA.map((p) => p.slug);
  const unique = Array.from(new Set([...contentSlugs, ...dataSlugs]));
  return unique.map((slug) => ({ slug }));
}

type RouteParams = { slug: string };

// NOTE: `searchParams` is a Promise to satisfy your global PageProps,
// but we do NOT await or use it (static export cannot await searchParams).
export default async function ProjectDetailPage({
  params,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;

  const meta = await loadMeta(slug);
  const fallback = DATA.find((p) => p.slug === slug);
  if (!meta && !fallback) return notFound();

  const title = meta?.title ?? fallback!.title ?? slug;
  const summary = (meta?.summary ?? fallback?.description) || undefined;

  // README (may be null)
  const content = await loadMarkdown(slug);

  // Posts list + content (all inline; no query strings, no extra routes)
  const postsMeta = await getProjectPosts(slug);
  const posts = await Promise.all(
    postsMeta.map(async (pm) => {
      const data = await loadPost(slug, pm.slug);
      return data
        ? {
            slug: pm.slug,
            title:
              (typeof data.meta.title === "string" && data.meta.title.trim()) ||
              pm.title ||
              pm.slug.replace(/[-_]/g, " "),
            date:
              (typeof data.meta.date === "string" && data.meta.date.trim()) ||
              pm.date ||
              undefined,
            content: data.content,
          }
        : null;
    })
  );

  const postsClean = posts.filter(Boolean) as Array<{
    slug: string;
    title: string;
    date?: string;
    content: string;
  }>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/projects" className="underline text-sm hover:text-primary">
          ← Back to projects
        </Link>

        <header className="mt-6 space-y-2">
          <h1 className="text-4xl font-bold">{title}</h1>
          {summary && <p className="text-lg text-muted-foreground">{summary}</p>}
        </header>

        {/* README */}
        {content ? (
          <article className="mt-8">
            {/* Prefix relative images to /public/projects/<slug>/... */}
            <Markdown imageBase={`/projects/${slug}`}>{content}</Markdown>
          </article>
        ) : (
          <article className="mt-8 rounded-lg border bg-card p-6">
            <p className="text-muted-foreground">
              This page is currently being worked on. 
            </p>
          </article>
        )}

        {/* Posts (inline, same page) */}
        {!!postsClean.length && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold">Posts</h2>
            <div className="mt-6 space-y-10">
              {postsClean.map((p) => (
                <article key={p.slug} id={`post-${p.slug}`}>
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  {p.date && (
                    <p className="text-sm text-muted-foreground">
                      {new Date(p.date).toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-3 prose prose-neutral dark:prose-invert max-w-none">
                    <Markdown imageBase={`/projects/${slug}`}>{p.content}</Markdown>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
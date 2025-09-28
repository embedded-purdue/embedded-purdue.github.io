// app/projects/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Markdown from "@/components/Markdown";
import { loadMeta, loadMarkdown, getAllProjectSlugs } from "@/lib/projects";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const slugs = await getAllProjectSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const meta = await loadMeta(slug);
  if (!meta) return notFound();

  const md = await loadMarkdown(slug);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-6">
          <Link
            href="/projects"
            className="text-sm underline text-muted-foreground hover:text-foreground"
          >
            ← Back to all projects
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-bold">{meta.title}</h1>
          {"semester" in meta && meta.semester ? (
            <p className="text-muted-foreground">{String(meta.semester)}</p>
          ) : null}
          {"summary" in meta && meta.summary ? (
            <p className="mt-2 text-muted-foreground">{String(meta.summary)}</p>
          ) : null}
        </header>

        {md ? (
          <article>
            <Markdown imageBase={`/projects/${slug}`}>{md}</Markdown>
          </article>
        ) : (
          <article className="rounded-lg border bg-card p-6">
            <p className="text-muted-foreground">
              README coming soon. Create{" "}
              <code className="rounded border bg-muted/50 px-1">
                content/projects/{slug}/index.md
              </code>{" "}
              to populate this page.
            </p>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
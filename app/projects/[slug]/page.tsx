// app/projects/[slug]/page.tsx
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Markdown from "@/components/Markdown";
import { notFound } from "next/navigation";
import { loadMeta, loadMarkdown } from "@/lib/projects";
import { projects } from "../_data";
import Link from "next/link";

type ParamsPromise = Promise<{ slug: string }>;

export default async function ProjectDetailPage({ params }: { params: ParamsPromise }) {
  const { slug } = await params;

  if (!projects.some((p) => p.slug === slug)) return notFound();

  const meta = await loadMeta(slug);
  if (!meta) return notFound();

  const md = await loadMarkdown(slug);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-6">
          <Link href="/projects" className="text-sm underline text-muted-foreground hover:text-foreground">
            ← Back to all projects
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-bold">{meta.title}</h1>
          {meta.semester && <p className="text-muted-foreground">{meta.semester}</p>}
          {meta.summary && <p className="mt-2 text-muted-foreground">{meta.summary}</p>}
        </header>

        {md ? (
          <article>
            {/* 👇 Prefix all relative image paths with `/projects/<slug>` */}
            <Markdown imageBase={`/projects/${slug}`}>{md}</Markdown>
          </article>
        ) : (
          <article className="rounded-lg border bg-card p-6">
            <p className="text-muted-foreground">
              README coming soon. Create{" "}
              <code className="rounded border bg-muted/50 px-1">content/projects/{slug}/index.md</code>{" "}
              to populate this page.
            </p>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
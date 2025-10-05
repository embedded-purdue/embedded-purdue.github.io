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

export const dynamic = "error";
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  const params: Array<{ slug: string; post: string }> = [];

  for (const slug of slugs) {
    const posts = await getProjectPosts(slug);
    for (const p of posts) {
      params.push({ slug, post: p.slug });
    }
  }

  return params;
}

type PageProps = {
  params: Promise<{ slug: string; post: string }>;
};

export default async function ProjectPostPage({ params }: PageProps) {
  const { slug, post } = await params;

  const meta = await loadMeta(slug);
  if (!meta) return notFound();

  const data = await loadPost(slug, post);
  if (!data) return notFound();

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
        <Link
          href={`/projects/${slug}`}
          className="underline text-sm hover:text-primary"
        >
          ← Back to {meta.title}
        </Link>
        <div className="mt-6">
          <h1 className="text-3xl font-bold">{title}</h1>
          {dateStr && (
            <p className="mt-2 text-sm text-muted-foreground">{dateStr}</p>
          )}
        </div>
        <article className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
          <Markdown imageBase={`/projects/${slug}`}>{data.content}</Markdown>
        </article>
      </main>
      <Footer />
    </div>
  );
}
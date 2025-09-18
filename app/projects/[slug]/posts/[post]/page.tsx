import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Markdown from "@/components/Markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import { loadPost, loadMeta } from "@/lib/projects"; // FIXED: Removed duplicate import
import { ArrowLeft } from "lucide-react"; // Import for ArrowLeft

type ParamsPromise = Promise<{ slug: string; post: string }>;

export default async function ProjectPostPage({
  params,
}: {
  params: ParamsPromise;
}) {
  const { slug, post } = await params;

  const projectMeta = await loadMeta(slug);
  if (!projectMeta) return notFound();

  const data = await loadPost(slug, post);
  if (!data) return notFound();

  const { meta, content } = data;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6 flex items-center gap-2">
          <Link
            href={`/projects/${slug}`}
            className="inline-flex items-center gap-2 text-sm rounded-lg border px-3 py-1.5 hover:bg-muted/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {projectMeta.title}
          </Link>
        </div>

        <header className="mb-6">
          <p className="text-sm text-muted-foreground">{projectMeta.title}</p>
          <h1 className="text-3xl font-bold">
            {typeof meta.title === "string" ? meta.title : String(post)}
          </h1>
          {meta.date ? (
            <p className="text-muted-foreground">
              {new Date(meta.date as string).toLocaleDateString()}
            </p>
          ) : null}
        </header>

        <article className="prose-md">
          <Markdown>{content}</Markdown>
        </article>
      </main>
      <Footer />
    </div>
  );
}
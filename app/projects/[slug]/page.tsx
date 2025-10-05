// app/projects/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { loadMeta, getAllProjectSlugs } from "@/lib/projects";

export const dynamic = "error";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>; // ← Promise type
}) {
  const { slug } = await params; // ← await it!
  const meta = await loadMeta(slug);
  
  if (!meta) return notFound();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/projects" className="underline text-sm">
          ← Back to projects
        </Link>
        <h1 className="mt-4 text-3xl font-bold">{meta.title}</h1>
      </main>
      <Footer />
    </div>
  );
}
// app/workshops/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllWorkshops, getWorkshopBySlug } from "@/lib/workshops";
import { Navigation } from "@/components/navigation";
import Markdown from "@/components/Markdown";
import { Footer } from "@/components/footer";

type RouteParams = { slug: string };

type Meta = {
  title: string;
  summary?: string;
  cover?: string;
  image?: string;
  date?: string;
  location?: string;
  tags?: string[];
  slug: string;
};

/** Safely coerce the loose file meta into a strict Meta shape */
function normalizeMeta(loose: unknown): Meta | null {
  const m = (loose as Record<string, unknown>) || {};
  const slug = typeof m.slug === "string" ? m.slug : "";
  if (!slug) return null;

  const title =
    typeof m.title === "string" && m.title.trim().length > 0 ? m.title : slug;

  return {
    slug,
    title,
    summary: typeof m.summary === "string" ? m.summary : undefined,
    cover: typeof m.cover === "string" ? m.cover : undefined,
    image: typeof m.image === "string" ? m.image : undefined,
    date: typeof m.date === "string" ? m.date : undefined,
    location: typeof m.location === "string" ? m.location : undefined,
    tags: Array.isArray(m.tags) ? (m.tags as string[]) : undefined,
  };
}

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return getAllWorkshops().map((w) => ({ slug: w.slug }));
}

// ✅ FIX: params must be Promise<RouteParams>
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<RouteParams> 
}) {
  const { slug } = await params; // ← await it!
  const entry = getWorkshopBySlug(slug);
  if (!entry) return {};

  const meta = normalizeMeta(entry.meta);
  if (!meta) return {};

  const images = meta.cover ? [meta.cover] : meta.image ? [meta.image] : [];

  return {
    title: `${meta.title} • Embedded Systems at Purdue`,
    description: meta.summary ?? "",
    openGraph: {
      title: meta.title,
      description: meta.summary ?? "",
      images,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: meta.title,
      description: meta.summary ?? "",
      images,
    },
  };
}

// ✅ FIX: params must be Promise<RouteParams>
export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<RouteParams>; // ← Changed from RouteParams to Promise<RouteParams>
}) {
  const { slug } = await params; // ← await it!
  
  const entry = getWorkshopBySlug(slug);
  if (!entry) return notFound();

  const meta = normalizeMeta(entry.meta);
  if (!meta) return notFound();

  const cover = meta.cover ?? meta.image ?? null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <header className="mx-auto max-w-4xl px-4 pt-10">
        <Link href="/workshops" className="text-sm text-muted-foreground hover:underline">
          ← All workshops
        </Link>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">{meta.title}</h1>
        {meta.summary && <p className="mt-2 text-lg text-muted-foreground">{meta.summary}</p>}
        <div className="mt-3 text-sm text-muted-foreground">
          {meta.date
            ? new Intl.DateTimeFormat(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(meta.date))
            : "TBA"}
          {meta.location ? ` • ${meta.location}` : ""}
          {!!meta.tags?.length && <span className="ml-2">{meta.tags.slice(0, 3).join(" · ")}</span>}
        </div>
      </header>

      {cover && (
        <div className="mx-auto mt-6 max-w-4xl px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={`${meta.title} cover`}
            className="h-64 w-full rounded-xl object-cover"
            loading="lazy"
          />
        </div>
      )}

      <main className="mx-auto max-w-4xl px-4 py-10">
        <article>
          <Markdown>{entry.content}</Markdown>
        </article>
      </main>
      <Footer />
    </div>
  );
}
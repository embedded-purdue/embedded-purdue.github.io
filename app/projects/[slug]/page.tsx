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
  getProjectMedia,
  getAdditionalMarkdown,
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
  const extraPages = await getAdditionalMarkdown(slug);

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

  // Media (images, videos, docs) from /public/projects/<slug>
  const media = await getProjectMedia(slug);

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

        {/* Additional pages */}
        {!!extraPages.length && (
          <section className="mt-12 space-y-10">
            {extraPages.map((pg, i) => (
              <article key={`${pg.file}-${i}`}>
                <h2 className="text-2xl font-semibold mb-2">{pg.title}</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <Markdown imageBase={`/projects/${slug}`}>{pg.content}</Markdown>
                </div>
              </article>
            ))}
          </section>
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

        {/* Media gallery */}
        {(media.images.length || media.videos.length || media.docs.length || media.files.length) && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold">Media</h2>

            {/* Images */}
            {!!media.images.length && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {media.images.map((src) => (
                  <a
                    key={src}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-lg border bg-muted/10"
                  >
                    {/* Using img to avoid next/image config for public assets */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Project image" className="h-56 w-full object-cover" />
                  </a>
                ))}
              </div>
            )}

            {/* Videos and embeds */}
            {!!media.videos.length && (
              <div className="mt-8 space-y-6">
                {media.videos.map((src, i) => {
                  const lower = src.toLowerCase();
                  const isFile = lower.endsWith(".mp4") || lower.endsWith(".webm");
                  return (
                    <div key={`${src}-${i}`} className="overflow-hidden rounded-lg border bg-muted/10">
                      {isFile ? (
                        // Local video file
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <video src={src} controls className="w-full" preload="metadata" />
                      ) : (
                        // External embed
                        <iframe
                          src={src}
                          title={`Video ${i + 1}`}
                          className="w-full"
                          height={480}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Documents (PDF) */}
            {!!media.docs.length && (
              <div className="mt-8 space-y-8">
                {media.docs.map((src, i) => {
                  const lower = src.toLowerCase();
                  const isPdf = lower.endsWith(".pdf");
                  return (
                    <div key={`${src}-${i}`} className="overflow-hidden rounded-lg border bg-muted/10">
                      {isPdf ? (
                        <iframe
                          src={`${src}#view=FitH`}
                          title={`Document ${i + 1}`}
                          className="w-full"
                          height={800}
                          loading="lazy"
                        />
                      ) : (
                        <div className="p-4 flex items-center justify-between gap-4">
                          <span className="truncate text-sm">{src}</span>
                          <a
                            href={src}
                            className="underline text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Other files: code, html, data */}
            {!!media.files.length && (
              <div className="mt-8 space-y-8">
                {media.files.map((f, i) => {
                  const key = `${f.url}-${i}`;
                  // CSV quick preview: small table from first ~20 lines
                  const renderCsv = () => {
                    if (!f.content) return null;
                    const rows = f.content.split(/\r?\n/).slice(0, 20).map((r) => r.split(","));
                    if (!rows.length) return null;
                    const header = rows[0];
                    const body = rows.slice(1);
                    return (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr>
                              {header.map((h, j) => (
                                <th key={j} className="border px-2 py-1 text-left font-semibold">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {body.map((r, ri) => (
                              <tr key={ri}>
                                {r.map((c, cj) => (
                                  <td key={cj} className="border px-2 py-1">
                                    {c}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  };

                  return (
                    <div key={key} className="overflow-hidden rounded-lg border bg-muted/10">
                      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b">
                        <div className="truncate text-sm">{f.name}</div>
                        <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline text-sm">
                          Open
                        </a>
                      </div>

                      {f.kind === "html" ? (
                        <iframe src={f.url} title={f.name} className="w-full" height={600} loading="lazy" />
                      ) : f.kind === "code" && f.content ? (
                        <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
{f.content}
                        </pre>
                      ) : f.kind === "data" && f.ext === ".csv" ? (
                        <div className="p-4">{renderCsv()}</div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
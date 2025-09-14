import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

import { Navigation } from "@/components/navigation"
import { getAllWorkshops, getWorkshopBySlug } from "@/lib/workshops"

type Props = { params: { slug: string } }

export function generateStaticParams() {
  try {
    return getAllWorkshops().map((w) => ({ slug: w.slug }))
  } catch {
    return []
  }
}

export const revalidate = 60
export const dynamicParams = true

export function generateMetadata({ params }: Props) {
  const entry = getWorkshopBySlug(params.slug)
  if (!entry) return {}
  const { meta } = entry
  return {
    title: `${meta.title} • Workshops • Embedded Systems at Purdue`,
    description: (meta as any).summary ?? "Workshop details",
  }
}

// simple slugify (used only for anchor ids if needed)
function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
}

const mdComponents: import("react-markdown").Components = {
  h2: ({ children }) => {
    const text = String(children instanceof Array ? children.join(" ") : children)
    const id = slugify(text)
    return (
      <h2 id={id} className="group scroll-mt-24">
        <a href={`#${id}`} className="no-underline">
          {children}
        </a>
        <a
          aria-label="Link to section"
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
        >
          #
        </a>
      </h2>
    )
  },
  h3: ({ children }) => {
    const text = String(children instanceof Array ? children.join(" ") : children)
    const id = slugify(text)
    return (
      <h3 id={id} className="group scroll-mt-24">
        <a href={`#${id}`} className="no-underline">
          {children}
        </a>
        <a
          aria-label="Link to section"
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
        >
          #
        </a>
      </h3>
    )
  },
  img: ({ src, alt }) => (
    <figure className="my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || ""}
        alt={alt || ""}
        className="mx-auto rounded-xl border bg-muted/30 max-h-[480px] w-full object-contain"
        loading="lazy"
      />
      {alt ? <figcaption className="mt-2 text-center text-sm text-muted-foreground">{alt}</figcaption> : null}
    </figure>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-lg border">
      <table className="min-w-full">{children}</table>
    </div>
  ),
  code: ({ inline, className, children, ...props }) => {
    if (!inline) {
      return (
        <pre className="my-4 overflow-x-auto rounded-lg border bg-muted/30 p-4 text-sm">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      )
    }
    return (
      <code className="rounded-md border bg-muted/40 px-1.5 py-0.5 text-[0.9em]" {...props}>
        {children}
      </code>
    )
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 pl-4 italic text-muted-foreground bg-muted/20 py-2 rounded-r-md">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="leading-relaxed [&>li]:my-1.5">{children}</ul>,
  ol: ({ children }) => <ol className="leading-relaxed [&>li]:my-1.5">{children}</ol>,
}

export default function WorkshopDetailPage({ params }: Props) {
  const entry = getWorkshopBySlug(params.slug)
  if (!entry) return notFound()
  const { meta, content } = entry

  const cover = (meta as any).cover || (meta as any).image

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="mb-3 text-sm">
            <Link href="/workshops" className="text-muted-foreground hover:underline">
              ← Back to Workshops
            </Link>
          </p>
          <h1 className="text-3xl lg:text-5xl font-bold leading-tight">{(meta as any).title}</h1>
          <p className="mt-2 text-muted-foreground">
            {(meta as any).date ? new Date((meta as any).date).toLocaleString() : "TBA"}
            {(meta as any).location ? ` • ${(meta as any).location}` : ""}
            {(meta as any).duration ? ` • ${(meta as any).duration}` : ""}
            {(meta as any).level ? ` • Level: ${(meta as any).level}` : ""}
          </p>
        </div>
      </section>

      {/* Optional cover */}
      {cover ? (
        <div className="px-4">
          <div className="max-w-6xl mx-auto mt-6 rounded-2xl overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover as string} alt={`${(meta as any).title} cover`} className="w-full h-80 object-cover" />
          </div>
        </div>
      ) : null}

      {/* Content */}
      <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl px-4 py-12">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "append" }],
          ]}
          components={mdComponents}
        >
          {content}
        </ReactMarkdown>

        {(meta as any).instructors || (meta as any).rsvpUrl ? <hr className="my-10" /> : null}

        {(meta as any).instructors ? (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Instructors:</span> {(meta as any).instructors.join(", ")}
          </p>
        ) : null}

        {(meta as any).rsvpUrl ? (
          <p className="mt-2">
            <a
              href={(meta as any).rsvpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              RSVP / Details
            </a>
          </p>
        ) : null}
      </article>
    </div>
  )
}

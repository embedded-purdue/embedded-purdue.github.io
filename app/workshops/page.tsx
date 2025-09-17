import Link from "next/link"
import { getAllWorkshops } from "@/lib/workshops"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Workshops • Embedded Systems at Purdue",
  description: "Upcoming and past workshops: microcontrollers, PCB, debugging, and more.",
}

function parseDate(d?: string) {
  if (!d) return null
  const dt = new Date(d)
  return Number.isNaN(dt.getTime()) ? null : dt
}
function fmtDate(d?: string) {
  const dt = parseDate(d)
  return dt
    ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(dt)
    : (d || "TBA")
}
type SP = { when?: "all" | "upcoming" | "past"; tag?: string }

export default async function WorkshopsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = (await searchParams) ?? {}
  const all = getAllWorkshops()

  const allTags = [...new Set(all.flatMap((w: any) => w.tags ?? []))].sort((a, b) => a.localeCompare(b))
  const tag = (sp.tag ?? "").trim()

  // Default to "all"
  const when: "all" | "upcoming" | "past" =
    sp.when === "past" ? "past" : sp.when === "upcoming" ? "upcoming" : "all"

  const filtered = tag ? all.filter((w: any) => (w.tags ?? []).includes(tag)) : all
  const now = Date.now()
  const isUpcoming = (d?: string) => {
    const dt = parseDate(d)
    return !dt || dt.getTime() >= now
  }

  const upcoming = filtered
    .filter((w: any) => isUpcoming(w.date))
    .sort((a: any, b: any) => (parseDate(a.date)?.getTime() ?? Infinity) - (parseDate(b.date)?.getTime() ?? Infinity))

  const past = filtered
    .filter((w: any) => !isUpcoming(w.date))
    .sort((a: any, b: any) => (parseDate(b.date)?.getTime() ?? 0) - (parseDate(a.date)?.getTime() ?? 0))

  const list = when === "upcoming" ? upcoming : when === "past" ? past : filtered

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Workshops</h1>
            <p className="mt-2 text-muted-foreground">
              Learn embedded fundamentals through hands-on sessions. Click a workshop to view full details.
            </p>
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              href={`/workshops${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                when === "all" ? "border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({filtered.length})
            </Link>
            <Link
              href={`/workshops?when=upcoming${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                when === "upcoming" ? "border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Upcoming ({upcoming.length})
            </Link>
            <Link
              href={`/workshops?when=past${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                when === "past" ? "border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Past ({past.length})
            </Link>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/workshops${when === "past" ? "?when=past" : ""}`}
              className={`rounded-full border px-3 py-1 text-sm ${
                !tag ? "border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All tags
            </Link>
            {allTags.map((t) => {
              const qs = new URLSearchParams()
              if (when === "past") qs.set("when", "past")
              qs.set("tag", t)
              const active = tag === t
              return (
                <Link
                  key={t}
                  href={`/workshops?${qs.toString()}`}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    active ? "border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </Link>
              )
            })}
          </div>
        )}

        {!list.length && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>No workshops found</CardTitle>
              <CardDescription>
                {tag ? (
                  <>
                    No workshops match tag <code>{tag}</code>.{" "}
                    <Link href="/workshops" className="underline">Clear filters</Link>.
                  </>
                ) : when === "past" ? (
                  "No past workshops yet."
                ) : (
                  <>Add markdown files under <code>content/workshops/</code> to publish the first one.</>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {list.map((w: any) => {
            const cover = w.cover ?? w.image
            return (
              <Link key={w.slug} href={`/workshops/${w.slug}`} className="no-underline">
                <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover as string} alt={`${w.title} cover`} className="h-40 w-full object-cover" loading="lazy" />
                  )}
                  <CardHeader>
                    <CardTitle className="leading-tight">{w.title}</CardTitle>
                    {w.summary && <CardDescription>{w.summary}</CardDescription>}
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      {fmtDate(w.date)}
                      {w.location ? ` • ${w.location}` : ""}
                    </div>
                    {!!w.tags?.length && (
                      <div className="flex flex-wrap gap-2">
                        {w.tags.slice(0, 3).map((t: string) => (
                          <Badge key={t} variant="outline">{t}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
      <Footer />

    </div>
  )
}

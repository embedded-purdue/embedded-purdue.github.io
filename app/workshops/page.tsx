import Link from "next/link"
import { getAllWorkshops } from "@/lib/workshops"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"

export const metadata = {
  title: "Workshops • Embedded Systems at Purdue",
  description: "Upcoming and past workshops: microcontrollers, PCB, debugging, and more.",
}

function fmtDate(d?: string) {
  if (!d) return "TBA"
  const dt = new Date(d)
  return Number.isNaN(dt.getTime())
    ? d
    : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(dt)
}

type SearchParams = { when?: "upcoming" | "past"; tag?: string }

export default function WorkshopsPage({ searchParams = {} as SearchParams }) {
  const all = getAllWorkshops()

  const tagSet = new Set<string>()
  for (const w of all) (w.tags ?? []).forEach((t) => tagSet.add(t))
  const allTags = Array.from(tagSet).sort((a, b) => a.localeCompare(b))

  const tag = (searchParams.tag || "").trim()
  const filteredByTag = tag ? all.filter((w) => (w.tags ?? []).includes(tag)) : all

  const now = Date.now()
  const isUpcoming = (d?: string) => !d || Number.isNaN(new Date(d).getTime()) || new Date(d).getTime() >= now

  const upcoming = filteredByTag
    .filter((w) => isUpcoming(w.date))
    .sort((a, b) => {
      const ad = a.date ? new Date(a.date).getTime() : Number.POSITIVE_INFINITY
      const bd = b.date ? new Date(b.date).getTime() : Number.POSITIVE_INFINITY
      return ad - bd
    })

  const past = filteredByTag
    .filter((w) => !isUpcoming(w.date))
    .sort((a, b) => {
      const ad = a.date ? new Date(a.date).getTime() : 0
      const bd = b.date ? new Date(b.date).getTime() : 0
      return bd - ad
    })

  const when = searchParams.when === "past" ? "past" : "upcoming"
  const list = when === "upcoming" ? upcoming : past

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

          {/* When filter */}
          <div className="mt-3 flex gap-2">
            <Link
              href={`/workshops${tag ? `?when=upcoming&tag=${encodeURIComponent(tag)}` : ""}`}
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

        {/* Tag chips */}
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
              const href = new URLSearchParams()
              if (when === "past") href.set("when", "past")
              href.set("tag", t)
              const active = tag === t
              return (
                <Link
                  key={t}
                  href={`/workshops?${href.toString()}`}
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

        {/* Empty state */}
        {!list?.length && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>No workshops found</CardTitle>
              <CardDescription>
                {tag ? (
                  <>
                    No workshops match tag <code>{tag}</code>.{" "}
                    <Link href="/workshops" className="underline">
                      Clear filters
                    </Link>
                    .
                  </>
                ) : when === "past" ? (
                  "No past workshops yet."
                ) : (
                  <>
                    Add markdown files under <code>content/workshops/</code> to publish the first one.
                  </>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {list.map((w) => {
            const cover = (w as any).cover || (w as any).image
            return (
              <Link key={w.slug} href={`/workshops/${w.slug}`} className="no-underline">
                <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                  {cover ? (
                    <img
                      src={cover as string}
                      alt={`${w.title} cover`}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}

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
                        {w.tags.slice(0, 3).map((t) => (
                          <Badge key={t} variant="outline">
                            {t}
                          </Badge>
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
    </div>
  )
}

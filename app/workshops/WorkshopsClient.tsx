"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowUpRight, CalendarDays, MapPin, X } from "lucide-react"

type Workshop = {
  slug: string
  title: string
  date?: string
  location?: string
  summary?: string
  tags?: string[]
  cover?: string
  image?: string
}

function parseDate(date?: string) {
  if (!date) return null
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDate(date?: string) {
  const parsed = parseDate(date)
  return parsed
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(parsed)
    : date || "TBA"
}

function filterHref(when: "all" | "upcoming" | "past", tag: string) {
  const params = new URLSearchParams()
  if (when !== "all") params.set("when", when)
  if (tag) params.set("tag", tag)
  const query = params.toString()
  return query ? `/workshops?${query}` : "/workshops"
}

export default function WorkshopsClient({ workshops }: { workshops: Workshop[] }) {
  const searchParams = useSearchParams()
  const allTags = [...new Set(workshops.flatMap((workshop) => workshop.tags ?? []))].sort((a, b) =>
    a.localeCompare(b)
  )

  const tag = (searchParams.get("tag") ?? "").trim()
  const whenParam = searchParams.get("when")
  const when: "all" | "upcoming" | "past" =
    whenParam === "past" ? "past" : whenParam === "upcoming" ? "upcoming" : "all"

  const tagFiltered = tag ? workshops.filter((workshop) => (workshop.tags ?? []).includes(tag)) : workshops
  const now = Date.now()
  const isUpcoming = (date?: string) => {
    const parsed = parseDate(date)
    return !parsed || parsed.getTime() >= now
  }

  const upcoming = tagFiltered
    .filter((workshop) => isUpcoming(workshop.date))
    .sort(
      (a, b) =>
        (parseDate(a.date)?.getTime() ?? Number.POSITIVE_INFINITY) -
        (parseDate(b.date)?.getTime() ?? Number.POSITIVE_INFINITY)
    )

  const past = tagFiltered
    .filter((workshop) => !isUpcoming(workshop.date))
    .sort(
      (a, b) =>
        (parseDate(b.date)?.getTime() ?? 0) - (parseDate(a.date)?.getTime() ?? 0)
    )

  const all = [...tagFiltered].sort((a, b) => {
    const aTime = parseDate(a.date)?.getTime()
    const bTime = parseDate(b.date)?.getTime()
    if (aTime == null && bTime == null) return a.title.localeCompare(b.title)
    if (aTime == null) return -1
    if (bTime == null) return 1
    return bTime - aTime
  })

  const list = when === "upcoming" ? upcoming : when === "past" ? past : all
  const hasFilters = when !== "all" || Boolean(tag)

  return (
    <>
      <div className="border-b border-white/[0.08] px-5 py-8 sm:px-8 sm:py-9 lg:px-12 lg:py-10 xl:px-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {(
              [
                ["all", "All", tagFiltered.length],
                ["upcoming", "Upcoming", upcoming.length],
                ["past", "Past", past.length],
              ] as const
            ).map(([value, label, count]) => {
              const active = when === value
              return (
                <Link
                  key={value}
                  href={filterHref(value, tag)}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex h-11 items-center border-b font-mono text-[0.65rem] uppercase tracking-[0.12em] transition-colors ${
                    active
                      ? "border-[#daa000] text-[#e3b93e]"
                      : "border-transparent text-[#a49d91] hover:border-white/[0.16] hover:text-[#d8d2c7]"
                  }`}
                >
                  {label}
                  <span className="ml-2 text-[#969087]">{count}</span>
                </Link>
              )
            })}
          </div>

          {hasFilters && (
            <Link
              href="/workshops"
              scroll={false}
              className="inline-flex min-h-8 w-fit items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[#a49d91] transition-colors hover:text-[#f2c34f]"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Clear filters
            </Link>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/[0.1] pt-3">
            <Link
              href={filterHref(when, "")}
              scroll={false}
              aria-current={!tag ? "page" : undefined}
              className={`inline-flex min-h-8 items-center border-b font-mono text-[0.625rem] uppercase tracking-[0.1em] transition-colors ${
                !tag ? "border-[#daa000]/50 text-[#e2b63a]" : "border-transparent text-[#969087] hover:text-[#d8d2c7]"
              }`}
            >
              All topics
            </Link>
            {allTags.map((topic) => (
              <Link
                key={topic}
                href={filterHref(when, topic)}
                scroll={false}
                aria-current={tag === topic ? "page" : undefined}
                className={`inline-flex min-h-8 items-center border-b font-mono text-[0.625rem] uppercase tracking-[0.1em] transition-colors ${
                  tag === topic ? "border-[#daa000]/50 text-[#e2b63a]" : "border-transparent text-[#969087] hover:text-[#d8d2c7]"
                }`}
              >
                {topic}
              </Link>
            ))}
          </div>
        )}
      </div>

      {!list.length ? (
        <div className="px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-24">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#666159]">No sessions found</p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-[#ded8cd]">Nothing matches this view.</h2>
          <Link
            href="/workshops"
            scroll={false}
            className="mt-5 inline-flex items-center gap-2 text-sm text-[#b28c25] transition-colors hover:text-[#f2c34f]"
          >
            Reset workshop archive
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-px bg-white/[0.08] md:grid-cols-2">
          {list.map((workshop, index) => {
            const cover = workshop.cover ?? workshop.image
            const upcomingSession = isUpcoming(workshop.date)
            const featured = index === 0 && list.length > 1
            const fullRow = index === 0 || (index === list.length - 1 && list.length % 2 === 0)

            return (
              <Link
                key={workshop.slug}
                href={`/workshops/${workshop.slug}`}
                aria-label={`View ${workshop.title}`}
                prefetch={false}
                data-site-lift="card"
                className={`group block bg-[#0c0c0b] no-underline transition-colors hover:bg-[#11110f] ${
                  fullRow ? "md:col-span-2" : ""
                }`}
              >
                <article
                  className={`h-full ${
                    fullRow && cover ? "flex flex-col lg:grid lg:grid-cols-[1.08fr_.92fr]" : "flex flex-col"
                  }`}
                >
                  {cover && <div
                    className={`relative shrink-0 overflow-hidden bg-black ${
                      fullRow
                        ? "h-[250px] border-b border-white/[0.08] sm:h-[320px] lg:h-auto lg:min-h-[360px] lg:border-b-0 lg:border-r"
                        : "h-[200px] border-b border-white/[0.08]"
                    }`}
                  >
                      <img
                        src={cover}
                        alt={`${workshop.title} cover`}
                        className="absolute inset-0 h-full w-full object-cover opacity-[0.86] transition-opacity duration-300 ease-out group-hover:opacity-100"
                        loading="lazy"
                        decoding="async"
                      />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                      <span
                        className={`border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] ${
                          upcomingSession
                            ? "border-[#daa000]/50 bg-[#171409]/95 text-[#edc458]"
                            : "border-white/[0.2] bg-black/85 text-[#b2aca2]"
                        }`}
                      >
                        {upcomingSession ? "Upcoming" : "Archive"}
                      </span>
                      <span className="bg-black/85 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[#b2aca2]">
                        W-{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <ArrowUpRight
                      className="absolute bottom-4 right-4 h-5 w-5 text-[#c4bfb5] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#f2c34f]"
                      aria-hidden="true"
                    />
                  </div>}

                  <div className={`flex flex-1 flex-col px-5 py-6 sm:px-7 sm:py-7 ${featured ? "lg:px-9 lg:py-9" : ""}`}>
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.13em] text-[#969087]">
                        {featured ? "Featured session" : "Workshop session"}
                        {!cover && <span className="ml-3 text-[#b4a374]">{upcomingSession ? "Upcoming" : "Archive"}</span>}
                      </p>
                      {!cover && <ArrowUpRight className="h-5 w-5 shrink-0 text-[#b9b1a3] transition-colors group-hover:text-[#f2c34f]" aria-hidden="true" />}
                    </div>
                    <h2
                      className={`mt-2 font-medium leading-[0.98] tracking-[-0.05em] text-[#ebe6dc] ${
                        featured ? "text-[clamp(2rem,3.4vw,3.2rem)]" : "text-[clamp(1.6rem,2.6vw,2.2rem)]"
                      }`}
                    >
                      {workshop.title}
                    </h2>
                    {workshop.summary && (
                      <p className={`mt-4 max-w-2xl text-sm leading-6 text-[#a29b90] ${featured ? "line-clamp-5" : "line-clamp-3"}`}>
                        {workshop.summary}
                      </p>
                    )}

                    <div className="mt-auto pt-6">
                      <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-[#aaa295]">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5 text-[#8d7328]" aria-hidden="true" />
                            {formatDate(workshop.date)}
                          </span>
                          {workshop.location && (
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-[#8d7328]" aria-hidden="true" />
                              {workshop.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {!!workshop.tags?.length && (
                        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
                          {workshop.tags.slice(0, featured ? 7 : 5).map((topic) => (
                            <span key={topic} className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-[#969087]">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

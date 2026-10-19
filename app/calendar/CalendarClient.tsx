"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, CalendarPlus } from "lucide-react"

import {
  EVENT_KINDS,
  GOOGLE_SUBSCRIBE_URL,
  ICAL_SUBSCRIBE_URL,
  dayNumber,
  dayStart,
  formatDate,
  formatDay,
  googleEventUrl,
  monthIndexOf,
  monthStartDay,
  termOf,
  timeRange,
} from "@/lib/calendar"
import type { CalendarEvent, Term } from "@/lib/calendar"
import MonthGridClient from "./_MonthGridClient"

const WIDE_RAIL = "site-rail mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

type Standing = {
  id: string
  title: string
  kind: CalendarEvent["kind"]
  cadence: string
  time: string
  location?: string
  range: string
  skipped: string[]
  changed: string[]
  sessions: CalendarEvent[]
}

function SignalLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#aaa398]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
      <span>{children}</span>
    </div>
  )
}

function mostCommon<T>(values: T[]) {
  const counts = new Map<T, number>()
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1))
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
}

function inTerm(event: CalendarEvent, term: Term) {
  const start = Date.parse(event.start)
  return start >= term.start && start < term.end
}

function weekOf(event: CalendarEvent) {
  const day = dayNumber(event.start)
  return day - ((day + 4) % 7)
}

function groupByWeek(events: CalendarEvent[]) {
  const weeks = new Map<number, CalendarEvent[]>()
  events.forEach((event) => weeks.set(weekOf(event), [...(weeks.get(weekOf(event)) ?? []), event]))
  return [...weeks.entries()]
}

function whenLabel(event: CalendarEvent, now: number) {
  const start = Date.parse(event.start)
  if (start <= now) return "Happening now"
  const days = dayNumber(start) - dayNumber(now)
  if (days === 0) return Number(formatDate(start, { hour: "numeric", hourCycle: "h23" })) >= 17 ? "Tonight" : "Today"
  if (days === 1) return "Tomorrow"
  if (days < 14) return `In ${days} days`
  return `In ${Math.round(days / 7)} weeks`
}

function standingSessions(events: CalendarEvent[]): Standing[] {
  const series = new Map<string, CalendarEvent[]>()
  events.forEach((event) => {
    if (event.seriesId) series.set(event.seriesId, [...(series.get(event.seriesId) ?? []), event])
  })

  return [...series.values()]
    .filter((sessions) => sessions.length >= 3)
    .map((sessions) => {
      const days = sessions.map((session) => dayNumber(session.start))
      const step = mostCommon(days.slice(1).map((day, index) => day - days[index])) ?? 7
      const held = new Set(days)
      const skipped: string[] = []
      for (let day = days[0]; day < days[days.length - 1]; day += step) {
        if (!held.has(day)) skipped.push(formatDay(day, { month: "short", day: "numeric" }))
      }

      const time = mostCommon(sessions.map(timeRange)) ?? ""
      const weekday = formatDate(sessions[0].start, { weekday: "long" })
      const label = (session: CalendarEvent) => formatDate(session.start, { month: "short", day: "numeric" })
      const cadence =
        step === 7 ? `Every ${weekday}` : step === 14 ? `Every other ${weekday}` : step === 1 ? "Daily" : `Every ${step} days`

      return {
        id: sessions[0].seriesId ?? sessions[0].id,
        title: sessions[0].title,
        kind: sessions[0].kind,
        cadence,
        time,
        location: mostCommon(sessions.flatMap((session) => (session.location ? [session.location] : []))),
        range: `${label(sessions[0])} – ${label(sessions[sessions.length - 1])}`,
        skipped,
        changed: sessions
          .filter((session) => timeRange(session) !== time)
          .map((session) => `${label(session)} runs ${timeRange(session)}`),
        sessions,
      }
    })
}

function NextUpPanel({ next, following, now }: { next?: CalendarEvent; following?: CalendarEvent; now: number }) {
  return (
    <div className="flex min-h-[360px] flex-col bg-[#080807] lg:col-span-5 lg:min-h-[480px]">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-3.5 sm:px-7">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#8d887f]">Next up</p>
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#d6b65d]">
          {next ? whenLabel(next, now) : "Nothing scheduled"}
        </p>
      </div>

      {next ? (
        <div className="flex flex-1 flex-col justify-between gap-10 px-5 py-8 sm:px-7">
          <div className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-6">
            <div className="border-r border-white/[0.08] pr-5">
              <p className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-[#d6b65d]">
                {formatDate(next.start, { weekday: "short" })}
              </p>
              <p className="mt-3 text-[3.4rem] font-medium leading-[0.8] tracking-[-0.07em]">
                {formatDate(next.start, { day: "numeric" })}
              </p>
              <p className="mt-3 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-[#77726a]">
                {formatDate(next.start, { month: "short" })}
              </p>
            </div>
            <div className="min-w-0">
              <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] font-medium leading-[0.95] tracking-[-0.05em]">{next.title}</h2>
              <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa398]">
                {timeRange(next)}
                {next.location ? ` · ${next.location}` : ""}
              </p>
              {next.description && (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#8d887f]">{next.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={googleEventUrl(next)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-[#daa000]/35 bg-[#daa000]/[0.08] px-4 py-3 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-[#ddc16e] transition-colors hover:border-[#daa000] hover:bg-[#daa000] hover:text-[#11110f]"
            >
              Add to Google Calendar
              <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            {next.workshop && (
              <Link
                href={`/workshops/${next.workshop.slug}`}
                className="group inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#bdb6aa] transition-colors hover:text-[#f2c34f]"
              >
                Workshop details
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-end px-5 py-8 sm:px-7">
          <h2 className="max-w-sm text-[clamp(1.75rem,2.6vw,2.4rem)] font-medium leading-[0.95] tracking-[-0.05em]">
            Nothing on the calendar yet.
          </h2>
        </div>
      )}

      {following && (
        <div className="flex items-center justify-between gap-5 border-t border-white/[0.08] px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#625e57]">After that</p>
            <p className="mt-1 truncate text-sm font-medium text-[#d8d2c7]">{following.title}</p>
          </div>
          <p className="shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#8d887f]">
            {formatDate(following.start, { weekday: "short", month: "short", day: "numeric" })}
          </p>
        </div>
      )}
    </div>
  )
}

function StandingCard({ standing, now }: { standing: Standing; now: number }) {
  const next = standing.sessions.find((session) => Date.parse(session.end) > now)

  return (
    <div className="border-t border-white/[0.08] py-6">
      <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#77726a]">
        {EVENT_KINDS.find((item) => item.kind === standing.kind)?.single}
      </p>
      <h3 className="mt-2 text-2xl font-medium tracking-[-0.04em]">{standing.title}</h3>
      <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#bdb6aa]">
        {standing.cadence} · {standing.time}
        {standing.location ? ` · ${standing.location}` : ""}
      </p>
      <p className="mt-1.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[#625e57]">
        {standing.range} · {standing.sessions.length} sessions
      </p>
      {(standing.skipped.length > 0 || standing.changed.length > 0) && (
        <div className="mt-4 space-y-1 text-sm leading-6 text-[#8d887f]">
          {standing.skipped.length > 0 && <p>No session {standing.skipped.join(", ")}</p>}
          {standing.changed.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
      {next && (
        <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#d6b65d]">
          Next · {formatDate(next.start, { weekday: "short", month: "short", day: "numeric" })}
        </p>
      )}
    </div>
  )
}

function EventRow({ event, now }: { event: CalendarEvent; now: number }) {
  const past = Date.parse(event.end) <= now
  const titleClass = `text-lg font-medium tracking-[-0.03em] sm:text-xl ${past ? "text-[#a49d91]" : "text-[#ebe6dc]"}`

  return (
    <article className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-5 gap-y-4 border-t border-white/[0.06] px-5 py-5 sm:grid-cols-[3.75rem_minmax(0,1fr)_auto] sm:px-8 lg:px-10 xl:px-12">
      <div>
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#77726a]">
          {formatDate(event.start, { weekday: "short" })}
        </p>
        <p className={`mt-1.5 text-[1.75rem] font-medium leading-none tracking-[-0.05em] ${past ? "text-[#77726a]" : "text-[#ebe6dc]"}`}>
          {formatDate(event.start, { day: "numeric" })}
        </p>
        <p className="mt-1.5 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#5f5a51]">
          {formatDate(event.start, { month: "short" })}
        </p>
      </div>

      <div className="min-w-0">
        {event.workshop ? (
          <Link href={`/workshops/${event.workshop.slug}`} className="group inline-flex items-start gap-2">
            <h3 className={`${titleClass} transition-colors group-hover:text-[#f3efe6]`}>{event.title}</h3>
            <ArrowUpRight
              className="mt-1 h-4 w-4 shrink-0 text-[#777169] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f2c34f]"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <h3 className={titleClass}>{event.title}</h3>
        )}
        <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#8d887f]">
          {timeRange(event)}
          {event.location ? ` · ${event.location}` : ""}
        </p>
        {event.description && <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-[#77726a]">{event.description}</p>}
      </div>

      <div className="col-start-2 flex items-center gap-5 sm:col-start-auto sm:flex-col sm:items-end sm:justify-between sm:gap-3">
        <span
          className={`font-mono text-[0.55rem] uppercase tracking-[0.14em] ${
            event.kind === "workshop" ? "text-[#d6b65d]" : "text-[#77726a]"
          }`}
        >
          {EVENT_KINDS.find((item) => item.kind === event.kind)?.single}
        </span>
        {!past && (
          <a
            href={googleEventUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Add ${event.title} to Google Calendar`}
            className="inline-flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#bdb6aa] transition-colors hover:text-[#f2c34f]"
          >
            <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
            Add
          </a>
        )}
      </div>
    </article>
  )
}

function WeekList({ events, now }: { events: CalendarEvent[]; now: number }) {
  const today = dayNumber(now)
  const thisWeek = today - ((today + 4) % 7)

  return (
    <div>
      {groupByWeek(events).map(([week, list]) => (
        <div key={week} className="border-b border-white/[0.08] last:border-b-0">
          <div className="flex items-center justify-between gap-4 bg-[#0a0a09] px-5 py-3 sm:px-8 lg:px-10 xl:px-12">
            <p className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-[#8d887f]">
              Week of {formatDay(week, { month: "short", day: "numeric" })}
            </p>
            {week === thisWeek && (
              <p className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-[#d6b65d]">This week</p>
            )}
          </div>
          {list.map((event) => (
            <EventRow key={event.id} event={event} now={now} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function CalendarClient({ events, builtAt }: { events: CalendarEvent[]; builtAt: string }) {
  const [now, setNow] = useState(() => Date.parse(builtAt))
  const [chosenMonth, setChosenMonth] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const currentMonth = monthIndexOf(now)
  const month = chosenMonth ?? currentMonth
  const timedMonths = events.filter((event) => !event.allDay).map((event) => monthIndexOf(event.start))
  const minMonth = Math.min(currentMonth, ...timedMonths)
  const maxMonth = Math.max(currentMonth, ...timedMonths) + 2
  const fallbackMonth = [...timedMonths].reverse().find((index) => index < month)
  const term = termOf(dayStart(monthStartDay(month)))
  const termEvents = events.filter((event) => inTerm(event, term))

  const upcoming = events.filter((event) => !event.allDay && Date.parse(event.end) > now)
  const standing = standingSessions(termEvents)
  const standingIds = new Set(standing.flatMap((item) => item.sessions.map((session) => session.id)))
  const oneOffs = termEvents.filter((event) => !standingIds.has(event.id))
  const comingUp = oneOffs.filter((event) => Date.parse(event.end) > now)
  const earlier = oneOffs.filter((event) => Date.parse(event.end) <= now)

  return (
    <>
      <section className="border-b border-white/[0.08] bg-black">
        <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
          <div className="grid lg:grid-cols-12">
            <div className="border-b border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12 lg:col-span-7 lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
              <div className="flex h-full flex-col justify-between gap-12">
                <div className="flex items-center justify-between gap-5">
                  <SignalLabel>Club calendar</SignalLabel>
                  <span className="hidden font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#4f4b45] sm:block">
                    Synced from Google Calendar
                  </span>
                </div>

                <div>
                  <h1 className="text-[clamp(3.3rem,6.3vw,6.6rem)] font-medium leading-[0.84] tracking-[-0.07em]">
                    When and where
                    <span className="block text-[#d8aa27]">to show up.</span>
                  </h1>
                  <p className="mt-7 max-w-xl text-base leading-7 text-[#8d887f]">Workshops, workdays, and club events.</p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <span className="w-full font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#625e57]">Subscribe</span>
                    <a
                      href={GOOGLE_SUBSCRIBE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 bg-[#daa000] px-5 py-3.5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.15em] text-[#12110d] transition-colors hover:bg-[#efbd2f]"
                    >
                      Google Calendar
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </a>
                    <a
                      href={ICAL_SUBSCRIBE_URL}
                      className="group inline-flex items-center gap-3 border border-white/[0.12] px-5 py-3.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[#c9c3b8] transition-colors hover:border-white/[0.24] hover:text-white"
                    >
                      Apple or Outlook
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <NextUpPanel next={upcoming[0]} following={upcoming[1]} now={now} />
          </div>
        </div>
      </section>

      <section className="bg-[#0c0c0b]">
        <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
          <MonthGridClient
            events={events}
            now={now}
            month={month}
            minMonth={minMonth}
            maxMonth={maxMonth}
            fallbackMonth={fallbackMonth}
            onMonthChange={setChosenMonth}
          />
        </div>
      </section>

      {termEvents.length > 0 && (
        <section className="bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <aside className="border-b border-white/[0.08] px-5 py-9 sm:px-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:px-10 lg:py-12 xl:px-12">
                <div className="lg:sticky lg:top-[100px]">
                  <SignalLabel>Agenda</SignalLabel>
                  <h2 className="mt-4 text-[clamp(2.4rem,3.6vw,3.6rem)] font-medium leading-[0.9] tracking-[-0.055em]">
                    {term.label}
                  </h2>
                  <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#6f6b64]">
                    {termEvents.length} events
                  </p>

                  {standing.length > 0 && (
                    <div className="mt-8">
                      <p className="pb-3 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#8d887f]">Recurring</p>
                      {standing.map((item) => (
                        <StandingCard key={item.id} standing={item} now={now} />
                      ))}
                    </div>
                  )}
                </div>
              </aside>

              <div className="lg:col-span-8">
                {comingUp.length > 0 && <WeekList events={comingUp} now={now} />}
                {earlier.length > 0 &&
                  (comingUp.length > 0 ? (
                    <details className="border-t border-white/[0.08]">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#a49d91] transition-colors hover:text-[#f2c34f] sm:px-8 lg:px-10 xl:px-12 [&::-webkit-details-marker]:hidden">
                        Earlier in {term.label}
                        <span className="text-[#6f6b64]">{earlier.length}</span>
                      </summary>
                      <WeekList events={earlier} now={now} />
                    </details>
                  ) : (
                    <WeekList events={earlier} now={now} />
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

import ical from "node-ical"
import type { VEvent } from "node-ical"

import { CALENDAR_ID, CALENDAR_TIME_ZONE, dateKey, wallTimeToMs } from "@/lib/calendar"
import type { CalendarEvent, EventKind } from "@/lib/calendar"
import { getAllWorkshops } from "@/lib/workshops"
import type { WorkshopMeta } from "@/lib/workshops"

const FEED_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`
const DAY = 86_400_000
const KINDS: EventKind[] = ["workshop", "build", "club", "career"]
const INTERNAL_TITLE = /\b(admin|pm|officer|exec|board) meeting\b/i

type Occurrence = {
  source: Omit<VEvent, "recurrences">
  start: Date
  end: Date
}

function text(value: unknown) {
  if (typeof value === "string") return value.trim()
  if (value && typeof value === "object" && "val" in value) return String(value.val).trim()
  return ""
}

function cleanDescription(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/#(workshop|build|club|career|internal)\b/gi, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function tagsOf(value: string) {
  return new Set(Array.from(value.matchAll(/#([a-z]+)/gi), (match) => match[1].toLowerCase()))
}

function sharesWord(a: string, b: string) {
  const words = (value: string) => value.toLowerCase().match(/[a-z0-9+]{3,}/g) ?? []
  const other = new Set(words(b))
  return words(a).some((word) => other.has(word))
}

function workshopFor(title: string, start: number, description: string, workshops: WorkshopMeta[]) {
  const linkedSlug = description.match(/\/workshops\/([a-z0-9-]+)/i)?.[1]
  const workshop =
    workshops.find((item) => item.slug === linkedSlug) ??
    workshops.find(
      (item) =>
        item.date &&
        !Number.isNaN(Date.parse(item.date)) &&
        dateKey(item.date) === dateKey(start) &&
        sharesWord(title, item.title)
    )
  return workshop ? { slug: workshop.slug, title: workshop.title } : undefined
}

function kindOf(title: string, tags: Set<string>, workshop?: { slug: string }): EventKind {
  const tagged = KINDS.find((kind) => tags.has(kind))
  if (tagged) return tagged
  if (workshop || /workshop|\b101\b/i.test(title)) return "workshop"
  if (/workday|work session|build night|hack|showcase|challenge/i.test(title)) return "build"
  if (/info session|internship|career|resume|expo|fair|recruit/i.test(title)) return "career"
  return "club"
}

function occurrences(event: VEvent, from: Date, to: Date): Occurrence[] {
  const end = event.end ?? event.start
  if (!event.rrule) return [{ source: event, start: event.start, end }]

  const duration = end.getTime() - event.start.getTime()
  const timeZone = event.rrule.origOptions.tzid

  return event.rrule.between(from, to, true).flatMap((wall): Occurrence[] => {
    const key = wall.toISOString().slice(0, 10)
    if (event.exdate?.[key]) return []

    const moved = event.recurrences?.[key]
    if (moved) return moved.status === "CANCELLED" ? [] : [{ source: moved, start: moved.start, end: moved.end ?? moved.start }]

    const start = timeZone && event.datetype !== "date" ? new Date(wallTimeToMs(wall, timeZone)) : wall
    return [{ source: event, start, end: new Date(start.getTime() + duration) }]
  })
}

function allDaySpan(start: Date, end: Date) {
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY))
  const midnight = (offset: number) =>
    wallTimeToMs(new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate() + offset)), CALENDAR_TIME_ZONE)
  return [midnight(0), midnight(days)]
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const response = await fetch(FEED_URL)
  if (!response.ok) throw new Error(`Google Calendar feed responded ${response.status}`)

  const feed = ical.sync.parseICS(await response.text())
  const workshops = getAllWorkshops()
  const now = Date.now()
  const from = new Date(now - 730 * DAY)
  const to = new Date(now + 400 * DAY)

  return Object.values(feed)
    .filter((item): item is VEvent => item.type === "VEVENT" && !item.recurrenceid)
    .flatMap((event) =>
      occurrences(event, from, to).flatMap(({ source, start, end }): CalendarEvent[] => {
        const summary = text(source.summary)
        const rawDescription = text(source.description)
        const tags = tagsOf(rawDescription)
        if (source.status === "CANCELLED" || tags.has("internal") || INTERNAL_TITLE.test(summary)) return []

        const allDay = event.datetype === "date"
        const [startMs, endMs] = allDay ? allDaySpan(start, end) : [start.getTime(), end.getTime()]
        if (startMs < from.getTime() || startMs > to.getTime()) return []

        const title = summary.replace(/^ES@P\s+(?!x\s)/i, "") || "Untitled event"
        const description = cleanDescription(rawDescription)
        const workshop = workshopFor(title, startMs, rawDescription, workshops)

        return [
          {
            id: `${event.uid}-${startMs}`,
            seriesId: event.rrule ? event.uid : undefined,
            title,
            kind: kindOf(title, tags, workshop),
            start: new Date(startMs).toISOString(),
            end: new Date(Math.max(startMs, endMs)).toISOString(),
            allDay,
            location: text(source.location).split(",")[0].trim() || undefined,
            description: description || undefined,
            workshop,
          },
        ]
      })
    )
    .sort((a, b) => a.start.localeCompare(b.start))
}

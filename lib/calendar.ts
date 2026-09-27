export const CALENDAR_ID = "embedded@purdue.edu"
export const CALENDAR_TIME_ZONE = "America/Indiana/Indianapolis"
export const GOOGLE_SUBSCRIBE_URL = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(CALENDAR_ID)}`
export const ICAL_SUBSCRIBE_URL = `webcal://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`

const DAY = 86_400_000

export type EventKind = "workshop" | "build" | "club" | "career"

export type CalendarEvent = {
  id: string
  seriesId?: string
  title: string
  kind: EventKind
  start: string
  end: string
  allDay: boolean
  location?: string
  description?: string
  workshop?: { slug: string; title: string }
}

export type Term = {
  key: string
  label: string
  start: number
  end: number
}

export const EVENT_KINDS: { kind: EventKind; label: string; single: string }[] = [
  { kind: "workshop", label: "Workshops", single: "Workshop" },
  { kind: "build", label: "Build", single: "Build session" },
  { kind: "club", label: "Club", single: "Club event" },
  { kind: "career", label: "Career", single: "Career event" },
]

const SEASONS = [
  { name: "Spring", from: [0, 1], to: [4, 15] },
  { name: "Summer", from: [4, 16], to: [7, 15] },
  { name: "Fall", from: [7, 16], to: [11, 31] },
] as const

function zoneParts(value: number, timeZone: string, options: Intl.DateTimeFormatOptions) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, ...options }).formatToParts(value)
  return (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ""
}

function zoneOffset(value: number, timeZone: string) {
  const part = zoneParts(value, timeZone, {
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })
  const wall = Date.UTC(+part("year"), +part("month") - 1, +part("day"), +part("hour"), +part("minute"), +part("second"))
  return wall - Math.floor(value / 1000) * 1000
}

export function wallTimeToMs(wall: Date, timeZone = CALENDAR_TIME_ZONE) {
  const guess = wall.getTime()
  return guess - zoneOffset(guess - zoneOffset(guess, timeZone), timeZone)
}

export function formatDate(value: string | number, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { timeZone: CALENDAR_TIME_ZONE, ...options }).format(new Date(value))
}

export function formatDay(day: number, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options }).format(day * DAY)
}

export function dateKey(value: string | number) {
  const part = zoneParts(new Date(value).getTime(), CALENDAR_TIME_ZONE, { year: "numeric", month: "2-digit", day: "2-digit" })
  return `${part("year")}-${part("month")}-${part("day")}`
}

export function dayNumber(value: string | number) {
  const [year, month, day] = dateKey(value).split("-").map(Number)
  return Date.UTC(year, month - 1, day) / DAY
}

export function dayStart(day: number) {
  return wallTimeToMs(new Date(day * DAY))
}

export function monthIndexOf(value: string | number) {
  const [year, month] = dateKey(value).split("-").map(Number)
  return year * 12 + month - 1
}

export function monthStartDay(index: number) {
  return Date.UTC(Math.floor(index / 12), index % 12, 1) / DAY
}

export function monthLength(index: number) {
  return new Date(Date.UTC(Math.floor(index / 12), (index % 12) + 1, 0)).getUTCDate()
}

function clock(value: string) {
  return formatDate(value, { hour: "numeric", minute: "2-digit" }).replace(/\s+/g, " ")
}

export function timeRange(event: CalendarEvent) {
  if (event.allDay) return "All day"
  const start = clock(event.start)
  const end = clock(event.end)
  if (start === end) return start
  const [time, period] = start.split(" ")
  return end.endsWith(period) ? `${time}–${end}` : `${start}–${end}`
}

export function termOf(value: string | number): Term {
  const [year, month, day] = dateKey(value).split("-").map(Number)
  const season = SEASONS.find((item) => (month - 1) * 100 + day <= item.to[0] * 100 + item.to[1]) ?? SEASONS[2]
  return {
    key: `${season.name.toLowerCase()}-${year}`,
    label: `${season.name} ${year}`,
    start: wallTimeToMs(new Date(Date.UTC(year, season.from[0], season.from[1]))),
    end: wallTimeToMs(new Date(Date.UTC(year, season.to[0], season.to[1] + 1))),
  }
}

function stamp(value: string) {
  return new Date(value).toISOString().replace(/[-:]|\.\d{3}/g, "")
}

export function googleEventUrl(event: CalendarEvent) {
  const dates = event.allDay
    ? `${dateKey(event.start).replace(/-/g, "")}/${dateKey(event.end).replace(/-/g, "")}`
    : `${stamp(event.start)}/${stamp(event.end)}`
  const params = new URLSearchParams({ action: "TEMPLATE", text: event.title, dates })
  if (event.location) params.set("location", event.location)
  if (event.description) params.set("details", event.description)
  return `https://calendar.google.com/calendar/render?${params}`
}

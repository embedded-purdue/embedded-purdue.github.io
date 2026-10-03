// app/components/upcoming-events.tsx
import ical from "node-ical"

const ICS_URL = "https://calendar.google.com/calendar/ical/embedded%40purdue.edu/public/basic.ics"

type CalendarEvent = {
  type?: string
  uid?: string
  summary?: string
  start?: string | Date
  end?: string | Date
  location?: string
}

function isCalendarEvent(value: unknown): value is CalendarEvent {
  return typeof value === "object" && value !== null && (value as CalendarEvent).type === "VEVENT"
}

async function getUpcoming(limit = 8) {
  const data = await ical.async.fromURL(ICS_URL)
  const now = Date.now()
  const events = (Object.values(data) as unknown[])
    .filter(isCalendarEvent)
    .map((event) => ({
      id: event.uid || String(event.summary || event.start),
      title: String(event.summary || "Untitled event"),
      start: new Date(event.start || 0),
      end: new Date(event.end || event.start || 0),
      location: event.location,
      link: `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(String(event.summary || ""))}`,
    }))
    .filter(e => e.start.getTime() >= now - 60_000)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, limit)
  return events
}

export default async function UpcomingEvents() {
  const events = await getUpcoming()
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {events.map(e => (
        <a key={e.id} href={e.link} target="_blank" rel="noopener noreferrer" className="no-underline">
          <div className="rounded-lg border p-4 hover:shadow-sm transition">
            <div className="text-sm text-muted-foreground">
              {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(e.start)}
            </div>
            <div className="mt-1 font-medium">{e.title}</div>
            {e.location && <div className="text-sm text-muted-foreground">{e.location}</div>}
          </div>
        </a>
      ))}
    </div>
  )
}
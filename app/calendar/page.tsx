import { getCalendarEvents } from "@/lib/calendar-feed"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"
import CalendarClient from "./CalendarClient"

export const metadata = {
  title: "Calendar • Embedded Systems at Purdue",
  description: "Workshops, workdays, and club events from the ES@P Google Calendar.",
}

export default async function CalendarPage() {
  const events = await getCalendarEvents()

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main data-site-main>
        <CalendarClient events={events} builtAt={new Date().toISOString()} />
      </main>

      <SiteFooter />
    </div>
  )
}

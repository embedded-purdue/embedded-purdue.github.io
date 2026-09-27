"use client"

import { useEffect, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarPlus } from "lucide-react"

import {
  EVENT_KINDS,
  dayNumber,
  formatDate,
  formatDay,
  googleEventUrl,
  monthLength,
  monthStartDay,
  timeRange,
} from "@/lib/calendar"
import type { CalendarEvent, EventKind } from "@/lib/calendar"

const DAY = 86_400_000
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const CHIPS: Record<EventKind, string> = {
  workshop: "border-[#daa000] bg-[#daa000] text-[#12110d]",
  club: "border-[#daa000] bg-[#daa000]/[0.08] text-[#ebe0c4]",
  build: "border-[#8d887f] bg-white/[0.035] text-[#d8d2c7]",
  career: "border-dashed border-[#77726a] text-[#a49d91]",
}

const DOTS: Record<EventKind, string> = {
  workshop: "bg-[#f2c34f]",
  club: "border border-[#daa000]",
  build: "bg-[#8d887f]",
  career: "border border-[#8d887f]",
}

const NAV_BUTTON =
  "inline-flex h-10 items-center gap-2 border border-white/[0.1] px-3 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#c9c3b8] transition-colors hover:border-white/[0.22] hover:text-white disabled:pointer-events-none disabled:opacity-30"

function monthOf(day: number) {
  const date = new Date(day * DAY)
  return date.getUTCFullYear() * 12 + date.getUTCMonth()
}

function clockShort(value: string) {
  return formatDate(value, { hour: "numeric", minute: "2-digit" }).replace(/\s+/g, "").replace(":00", "").toLowerCase()
}

export default function MonthGridClient({
  events,
  now,
  month,
  minMonth,
  maxMonth,
  fallbackMonth,
  onMonthChange,
}: {
  events: CalendarEvent[]
  now: number
  month: number
  minMonth: number
  maxMonth: number
  fallbackMonth?: number
  onMonthChange: (month: number) => void
}) {
  const [pickedDay, setPickedDay] = useState<number | null>(null)
  const cells = useRef(new Map<number, HTMLButtonElement>())
  const moved = useRef(false)

  const today = dayNumber(now)
  const first = monthStartDay(month)
  const last = first + monthLength(month) - 1
  const gridStart = first - ((first + 4) % 7)
  const gridEnd = last + 6 - ((last + 4) % 7)
  const days = Array.from({ length: gridEnd - gridStart + 1 }, (_, index) => gridStart + index)
  const label = formatDay(first, { month: "long", year: "numeric" })

  const byDay = new Map<number, CalendarEvent[]>()
  events.forEach((event) => {
    const start = dayNumber(event.start)
    const end = event.allDay ? dayNumber(Date.parse(event.end) - 1) : start
    for (let day = Math.max(start, gridStart); day <= Math.min(end, gridEnd); day++) {
      byDay.set(day, [...(byDay.get(day) ?? []), event])
    }
  })

  const inMonth = (day: number) => day >= first && day <= last
  const monthHasEvents = days.some((day) => inMonth(day) && byDay.has(day))
  const selected =
    pickedDay !== null && inMonth(pickedDay)
      ? pickedDay
      : inMonth(today)
        ? today
        : days.find((day) => inMonth(day) && byDay.has(day)) ?? first
  const selectedEvents = byDay.get(selected) ?? []

  useEffect(() => {
    if (!moved.current) return
    moved.current = false
    cells.current.get(selected)?.focus()
  })

  function choose(day: number) {
    const target = monthOf(day)
    if (target !== month) {
      if (target < minMonth || target > maxMonth) return
      onMonthChange(target)
    }
    setPickedDay(day)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (!(event.key in steps)) return
    event.preventDefault()
    moved.current = true
    choose(selected + steps[event.key])
  }

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-white/[0.08] px-5 py-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 xl:px-16">
        <div>
          <h2 className="flex items-center gap-3 font-mono text-[0.62rem] font-normal uppercase tracking-[0.18em] text-[#aaa398]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
            Month view
          </h2>
          <p className="mt-4 text-[clamp(2.2rem,3.4vw,3.4rem)] font-medium leading-[0.9] tracking-[-0.055em]">{label}</p>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onMonthChange(month - 1)}
              disabled={month <= minMonth}
              aria-label="Previous month"
              className={NAV_BUTTON}
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDay(monthStartDay(month - 1), { month: "short" })}
            </button>
            <button
              type="button"
              onClick={() => {
                onMonthChange(monthOf(today))
                setPickedDay(today)
              }}
              className={NAV_BUTTON}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => onMonthChange(month + 1)}
              disabled={month >= maxMonth}
              aria-label="Next month"
              className={NAV_BUTTON}
            >
              {formatDay(monthStartDay(month + 1), { month: "short" })}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {EVENT_KINDS.map((item) => (
              <span
                key={item.kind}
                className="inline-flex items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#8d887f]"
              >
                <span className={`h-2.5 w-2.5 border-l-2 ${CHIPS[item.kind]}`} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-12">
        <div className="xl:col-span-9">
          <div className="grid grid-cols-7 border-b border-white/[0.08] bg-[#080807]">
            {WEEKDAYS.map((weekday) => (
              <div key={weekday} className="px-1.5 py-2.5 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#6f6b64] sm:px-2">
                <span className="sm:hidden">{weekday[0]}</span>
                <span className="hidden sm:inline">{weekday}</span>
              </div>
            ))}
          </div>

          <div
            role="group"
            aria-label={`${label}. Use the arrow keys to move between days.`}
            onKeyDown={onKeyDown}
            className="grid grid-cols-7 gap-px bg-white/[0.08]"
          >
            {days.map((day) => {
              const list = byDay.get(day) ?? []
              const isToday = day === today
              const isSelected = day === selected
              const background = isSelected ? "bg-[#15140e]" : inMonth(day) ? "bg-[#0c0c0b] hover:bg-[#11110e]" : "bg-[#080807]"
              const dayOfMonth = new Date(day * DAY).getUTCDate()

              return (
                <button
                  key={day}
                  ref={(node) => {
                    if (node) cells.current.set(day, node)
                    else cells.current.delete(day)
                  }}
                  type="button"
                  tabIndex={isSelected ? 0 : -1}
                  aria-pressed={isSelected}
                  aria-label={`${formatDay(day, { weekday: "long", month: "long", day: "numeric" })}${
                    list.length ? `, ${list.length} ${list.length === 1 ? "event" : "events"}` : ""
                  }`}
                  onClick={() => choose(day)}
                  className={`flex min-h-[4.5rem] min-w-0 flex-col gap-1.5 p-1.5 text-left transition-colors sm:min-h-[7.25rem] sm:p-2 ${background} ${
                    isSelected ? "shadow-[inset_0_0_0_1px_rgba(218,160,0,.55)]" : ""
                  }`}
                >
                  <span
                    className={`flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] ${
                      isToday ? "text-[#f2c34f]" : inMonth(day) ? "text-[#aaa398]" : "text-[#4f4b45]"
                    }`}
                  >
                    {formatDay(day, dayOfMonth === 1 ? { month: "short", day: "numeric" } : { day: "numeric" })}
                    {isToday && <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />}
                  </span>

                  <span className="hidden min-w-0 flex-col gap-1 sm:flex">
                    {list.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        className={`flex min-w-0 items-center gap-1.5 border-l-2 px-1.5 py-[3px] text-[0.68rem] leading-tight ${CHIPS[event.kind]} ${
                          Date.parse(event.end) <= now ? "opacity-55" : ""
                        }`}
                      >
                        {!event.allDay && <span className="shrink-0 font-mono text-[0.52rem] opacity-75">{clockShort(event.start)}</span>}
                        <span className="truncate">{event.title}</span>
                      </span>
                    ))}
                    {list.length > 3 && (
                      <span className="font-mono text-[0.52rem] uppercase tracking-[0.12em] text-[#8d887f]">+{list.length - 3} more</span>
                    )}
                  </span>

                  {list.length > 0 && (
                    <span className="flex flex-wrap gap-1 sm:hidden">
                      {list.slice(0, 4).map((event) => (
                        <span key={event.id} className={`h-1.5 w-1.5 rounded-full ${DOTS[event.kind]}`} />
                      ))}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <aside
          aria-live="polite"
          className="border-t border-white/[0.08] px-5 py-7 sm:px-8 lg:px-12 xl:col-span-3 xl:border-l xl:border-t-0 xl:px-7 xl:py-8"
        >
          <p className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-[#d6b65d]">
            {selected === today ? "Today" : formatDay(selected, { weekday: "long" })}
          </p>
          <p className="mt-2 text-3xl font-medium tracking-[-0.05em]">{formatDay(selected, { month: "long", day: "numeric" })}</p>

          {selectedEvents.length > 0 ? (
            <div className="mt-6">
              {selectedEvents.map((event) => (
                <article key={event.id} className="border-t border-white/[0.08] py-5 first:border-t-0 first:pt-0">
                  <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#77726a]">
                    {EVENT_KINDS.find((item) => item.kind === event.kind)?.single}
                  </p>
                  {event.workshop ? (
                    <Link href={`/workshops/${event.workshop.slug}`} className="group mt-2 inline-flex items-start gap-2">
                      <h3 className="text-xl font-medium tracking-[-0.035em] text-[#ebe6dc] transition-colors group-hover:text-[#f3efe6]">
                        {event.title}
                      </h3>
                      <ArrowUpRight
                        className="mt-1 h-4 w-4 shrink-0 text-[#777169] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f2c34f]"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <h3 className="mt-2 text-xl font-medium tracking-[-0.035em] text-[#ebe6dc]">{event.title}</h3>
                  )}
                  <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa398]">
                    {timeRange(event)}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                  {event.description && <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#8d887f]">{event.description}</p>}
                  {Date.parse(event.end) > now && (
                    <a
                      href={googleEventUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#bdb6aa] transition-colors hover:text-[#f2c34f]"
                    >
                      <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
                      Add to Google Calendar
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : monthHasEvents ? (
            <p className="mt-6 text-sm leading-6 text-[#77726a]">Nothing scheduled this day.</p>
          ) : (
            <div className="mt-6 border-t border-white/[0.08] pt-5">
              <p className="text-sm leading-6 text-[#8d887f]">
                Nothing on the calendar for {formatDay(first, { month: "long" })} yet.
              </p>
              {fallbackMonth !== undefined && (
                <button
                  type="button"
                  onClick={() => onMonthChange(fallbackMonth)}
                  className="mt-3 inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#d6b65d] transition-colors hover:text-[#f2c34f]"
                >
                  See {formatDay(monthStartDay(fallbackMonth), { month: "long", year: "numeric" })}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

"use client"

import type { ChangeEvent } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowUpRight, ChevronDown, Search, X } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { resolveProjectImagePath } from "@/lib/project-media-path"
import { allStatuses, collectSemesters, collectTechs } from "./_data"
import type { Project as DataProject } from "./_data"

type Project = Omit<DataProject, "description" | "image" | "icon"> & {
  description?: string
  image?: string
}

const STATUS_ORDER: Record<string, number> = { Active: 0, Planned: 1, Completed: 2 }

const TRIGGER_CLS =
  "group flex h-11 w-full items-center gap-2 border-0 border-b border-white/[0.16] bg-transparent px-0 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-[#b5afa4] outline-none transition-colors hover:border-[#daa000]/45 hover:text-[#e6e0d5] focus-visible:border-[#daa000]/70 data-[state=open]:border-[#daa000] data-[state=open]:text-[#f2c34f] xl:w-44"
const TRIGGER_LABEL_CLS = "min-w-0 flex-1 truncate text-left"
const MENU_CLS =
  "min-w-[var(--radix-dropdown-menu-trigger-width)] rounded-none border-white/[0.16] bg-[#10100e] p-1 text-[#c7c1b7] shadow-[0_16px_40px_rgba(0,0,0,.4)] motion-reduce:animate-none"
const MENU_ITEM_CLS =
  "min-h-11 cursor-pointer rounded-none py-2.5 text-sm focus:bg-[#daa000]/[0.1] focus:text-[#f2c34f] data-[state=checked]:text-[#f2c34f]"

function resolveProjectHref(project: Project): { href: string; external: boolean } {
  const url = project.readmeUrl?.trim()
  if (url && /^https?:\/\//i.test(url)) return { href: url, external: true }
  if (url && url.startsWith("/content/")) return { href: `/projects/${project.slug}`, external: false }
  if (url && url.startsWith("/projects/")) return { href: url, external: false }
  return { href: `/projects/${project.slug}`, external: false }
}

function encodeTechs(techs: string[]) {
  return techs.join(",")
}

function decodeTechs(raw: string) {
  return raw ? raw.split(",").filter(Boolean) : []
}

function statusClass(status: string) {
  if (status === "Active") return "border-[#daa000]/50 bg-[#171409]/95 text-[#edc458]"
  if (status === "Planned") return "border-[#7b87a3]/45 bg-[#0c0c0b]/95 text-[#bbc4d8]"
  return "border-white/[0.2] bg-[#0c0c0b]/90 text-[#b2aca2]"
}

function ProjectCover({ source, title }: { source: string; title: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const isPlaceholder = source === "/projects/logo.png" || source === failedSource

  return isPlaceholder ? (
    <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(rgba(218,160,0,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(218,160,0,.055)_1px,transparent_1px)] bg-[size:32px_32px]">
      <img src="/logo.svg" alt="" className="h-auto w-40 max-w-[48%] opacity-65" loading="lazy" decoding="async" />
    </div>
  ) : (
    <img
      src={source}
      alt={`${title} project`}
      className="absolute inset-0 h-full w-full object-cover opacity-[0.86] transition-opacity duration-300 ease-out group-hover:opacity-100"
      loading="lazy"
      decoding="async"
      onError={() => setFailedSource(source)}
    />
  )
}

function TechCheckboxDropdown({
  allTechs,
  selectedTechs,
  onChange,
}: {
  allTechs: string[]
  selectedTechs: string[]
  onChange: (next: string[]) => void
}) {
  function toggle(tech: string) {
    onChange(
      selectedTechs.includes(tech)
        ? selectedTechs.filter((selected) => selected !== tech)
        : [...selectedTechs, tech]
    )
  }

  const label =
    selectedTechs.length === 0
      ? "All technologies"
      : selectedTechs.length === 1
        ? selectedTechs[0]
        : `${selectedTechs.length} technologies`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={TRIGGER_CLS} aria-label={`Filter technologies: ${label}`}>
          <span className={TRIGGER_LABEL_CLS}>{label}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform group-data-[state=open]:rotate-180" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" collisionPadding={16} className={`${MENU_CLS} w-64 max-h-80`}>
        {selectedTechs.length > 0 && (
          <DropdownMenuItem onSelect={() => onChange([])} className={`${MENU_ITEM_CLS} border-b border-white/[0.1]`}>
            <X className="h-3 w-3" aria-hidden="true" />
            Clear selection
          </DropdownMenuItem>
        )}
        {allTechs.map((tech) => (
          <DropdownMenuCheckboxItem
            key={tech}
            checked={selectedTechs.includes(tech)}
            onCheckedChange={() => toggle(tech)}
            onSelect={(event) => event.preventDefault()}
            className={MENU_ITEM_CLS}
          >
            {tech}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SelectDropdown({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string
  options: string[]
  placeholder: string
  onChange: (value: string) => void
}) {
  const label = value === "all" ? placeholder : value

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={TRIGGER_CLS} aria-label={`${placeholder}: ${label}`}>
          <span className={TRIGGER_LABEL_CLS}>{label}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform group-data-[state=open]:rotate-180" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" collisionPadding={16} className={MENU_CLS}>
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value="all" className={MENU_ITEM_CLS}>{placeholder}</DropdownMenuRadioItem>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option} value={option} className={MENU_ITEM_CLS}>{option}</DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function ProjectsGridClient({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedStatus = searchParams.get("status") ?? "all"
  const selectedTechs = useMemo(() => decodeTechs(searchParams.get("techs") ?? ""), [searchParams])
  const selectedSemester = searchParams.get("semester") ?? "all"
  const urlQuery = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(urlQuery)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  useEffect(
    () => () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    },
    []
  )

  const allTechs = useMemo(() => collectTechs(projects), [projects])
  const allSemesters = useMemo(() => collectSemesters(projects), [projects])

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase()
    const results = projects.filter((project) => {
      const statusMatches = selectedStatus === "all" || project.status === selectedStatus
      const techMatches =
        selectedTechs.length === 0 || selectedTechs.every((tech) => project.technologies.includes(tech))
      const semesterMatches = selectedSemester === "all" || project.semester === selectedSemester
      const queryMatches =
        !normalizedQuery ||
        project.title.toLowerCase().includes(normalizedQuery) ||
        project.description?.toLowerCase().includes(normalizedQuery) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(normalizedQuery))

      return statusMatches && techMatches && semesterMatches && queryMatches
    })

    const noFilters =
      selectedStatus === "all" &&
      selectedTechs.length === 0 &&
      selectedSemester === "all" &&
      !normalizedQuery

    return results.sort((a, b) => {
      if (noFilters) {
        const statusDifference = (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
        if (statusDifference !== 0) return statusDifference
      }
      return a.title.localeCompare(b.title)
    })
  }, [projects, query, selectedSemester, selectedStatus, selectedTechs])

  const hrefWith = useCallback(
    (status: string, techs: string[], semester: string, search: string) => {
      const params = new URLSearchParams()
      if (status !== "all") params.set("status", status)
      if (techs.length) params.set("techs", encodeTechs(techs))
      if (semester !== "all") params.set("semester", semester)
      if (search) params.set("q", search)
      const serialized = params.toString()
      return serialized ? `${pathname}?${serialized}` : pathname
    },
    [pathname]
  )

  const navigate = useCallback(
    (status: string, techs: string[], semester: string, search: string) => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
      router.push(hrefWith(status, techs, semester, search), { scroll: false })
    },
    [hrefWith, router]
  )

  function handleSelect(param: "status" | "semester", value: string) {
    if (param === "status") navigate(value, selectedTechs, selectedSemester, query)
    else navigate(selectedStatus, selectedTechs, value, query)
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value
    setQuery(nextQuery)
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      router.replace(hrefWith(selectedStatus, selectedTechs, selectedSemester, nextQuery), { scroll: false })
    }, 220)
  }

  const hasFilters =
    selectedStatus !== "all" || selectedTechs.length > 0 || selectedSemester !== "all" || Boolean(query)

  function clearFilters() {
    setQuery("")
    navigate("all", [], "all", "")
  }

  return (
    <>
      <div className="border-b border-white/[0.08] px-5 py-8 sm:px-8 sm:py-9 lg:px-12 lg:py-10 xl:px-16">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6e6961]" aria-hidden="true" />
            <input
              value={query}
              onChange={handleSearchChange}
              aria-label="Search projects"
              autoComplete="off"
              spellCheck={false}
              placeholder="Search projects, systems, technologies…"
              className="h-11 w-full border-0 border-b border-white/[0.16] bg-transparent py-2 pl-7 pr-4 text-sm text-[#e5dfd4] outline-none transition-colors placeholder:text-[#948d82] focus:border-[#daa000]/70"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:flex xl:gap-6">
            <SelectDropdown
              value={selectedStatus}
              options={[...allStatuses]}
              placeholder="All statuses"
              onChange={(value) => handleSelect("status", value)}
            />
            <TechCheckboxDropdown
              allTechs={allTechs}
              selectedTechs={selectedTechs}
              onChange={(techs) => navigate(selectedStatus, techs, selectedSemester, query)}
            />
            <SelectDropdown
              value={selectedSemester}
              options={allSemesters}
              placeholder="All semesters"
              onChange={(value) => handleSelect("semester", value)}
            />
          </div>
        </div>

        <div className="mt-5 flex min-h-5 flex-wrap items-center justify-between gap-3 font-mono text-[0.625rem] uppercase tracking-[0.13em]">
          <span role="status" className="text-[#969087]">
            {filtered.length} project{filtered.length === 1 ? "" : "s"}{hasFilters ? " matching filters" : " in archive"}
          </span>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="inline-flex min-h-8 items-center gap-2 uppercase tracking-[0.13em] text-[#b6afa3] transition-colors hover:text-[#f2c34f]">
              <X className="h-3 w-3" aria-hidden="true" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {!filtered.length ? (
        <div className="px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-24">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#666159]">No matching systems</p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-[#ded8cd]">Nothing fits those filters.</h2>
          <button type="button" onClick={clearFilters} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-[#d8aa27] transition-colors hover:text-[#f2c34f]">
            Reset project archive
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="grid gap-px bg-white/[0.08] md:grid-cols-2 xl:grid-cols-12">
          {filtered.map((project, index) => {
            const image = resolveProjectImagePath(project.slug, project.image)
            const { href, external } = resolveProjectHref(project)
            const solo = filtered.length === 1
            const featured = index === 0 && filtered.length > 1
            const emphasized = solo || featured
            const last = index === filtered.length - 1
            const remainder = filtered.length > 2 ? (filtered.length - 2) % 3 : 0
            const inLastRow = remainder > 0 && index >= filtered.length - remainder
            const wideAtDesktop = emphasized || (inLastRow && remainder === 1)
            const tabletSpan = emphasized || (last && filtered.length % 2 === 0) ? "md:col-span-2" : ""
            const desktopSpan = solo || (inLastRow && remainder === 1)
              ? "xl:col-span-12"
              : featured
                ? "xl:col-span-8"
                : inLastRow ? "xl:col-span-6" : "xl:col-span-4"
            const spanClass = `${tabletSpan} ${desktopSpan}`

            const inner = (
              <article
                className={`group h-full min-h-[440px] bg-[#0c0c0b] transition-colors hover:bg-[#11110f] ${
                  wideAtDesktop ? "flex flex-col xl:grid xl:grid-cols-[1.14fr_.86fr]" : "flex flex-col"
                }`}
              >
                <div
                  className={`relative shrink-0 overflow-hidden bg-black ${
                    wideAtDesktop
                      ? "h-[250px] border-b border-white/[0.08] sm:h-[320px] xl:h-auto xl:min-h-[440px] xl:border-b-0 xl:border-r"
                      : "h-[210px] border-b border-white/[0.08]"
                  }`}
                >
                  <ProjectCover source={image} title={project.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
                    <span className={`border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] ${statusClass(project.status)}`}>
                      {project.status}
                    </span>
                    {project.semester && (
                      <span className="bg-black/85 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-[#b6afa3]">
                        {project.semester}
                      </span>
                    )}
                  </div>
                  <ArrowUpRight className="absolute bottom-4 right-4 h-5 w-5 text-[#c4bfb5] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#f2c34f]" aria-hidden="true" />
                </div>

                <div className={`flex flex-1 flex-col px-5 py-6 sm:px-7 sm:py-7 ${emphasized ? "xl:px-9 xl:py-9" : ""}`}>
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[#969087]">Project / {project.slug}</p>
                  <h2
                    className={`mt-2.5 font-medium leading-[1.02] tracking-[-0.05em] text-[#e9e4da] ${
                      emphasized ? "text-[clamp(1.9rem,3vw,2.7rem)]" : "text-[1.65rem]"
                    }`}
                  >
                    {project.title}
                  </h2>
                  {project.description && (
                    <p className={`mt-4 text-sm leading-6 text-[#a29b90] ${emphasized ? "line-clamp-5" : "line-clamp-3"}`}>
                      {project.description}
                    </p>
                  )}

                  {!!project.technologies.length && (
                    <div className="mt-auto pt-6">
                      <div className="flex flex-wrap gap-x-3 gap-y-2 border-t border-white/[0.1] pt-4">
                        {project.technologies.slice(0, emphasized ? 7 : 5).map((technology) => (
                          <span key={`${project.slug}-${technology}`} className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-[#969087]">
                            {technology}
                          </span>
                        ))}
                        {project.technologies.length > (emphasized ? 7 : 5) && (
                          <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-[#969087]">
                            +{project.technologies.length - (emphasized ? 7 : 5)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )

            return external ? (
              <a
                key={project.slug}
                href={href}
                aria-label={`View ${project.title}`}
                target="_blank"
                rel="noopener noreferrer"
                data-site-lift="card"
                className={`${spanClass} block h-full no-underline`}
              >
                {inner}
              </a>
            ) : (
              <Link
                key={project.slug}
                href={href}
                aria-label={`View ${project.title}`}
                prefetch={false}
                data-site-lift="card"
                className={`${spanClass} block h-full no-underline`}
              >
                {inner}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

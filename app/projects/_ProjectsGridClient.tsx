// app/projects/_ProjectsGridClient.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Project = {
  slug: string;
  title: string;
  description?: string;
  image?: string;         // may be filename or absolute
  status: string;         // e.g., "Active" | "Completed" | ...
  technologies: string[];
  pm?: string;
  semester?: string;
  readmeUrl?: string;
};

function resolveProjectImage(p: Project) {
  const raw = p.image || "";
  if (!raw) return "/projects/logo.png";
  if (raw.startsWith("http")) return raw;

  // normalize to /projects/<slug>/<file>
  let path = raw.replace(/^\/+/, "");
  if (path.startsWith("projects/")) path = path.slice("projects/".length);
  if (path.startsWith(`${p.slug}/`)) return `/projects/${path}`;
  return `/projects/${p.slug}/${path}`;
}

export default function ProjectsGridClient({ projects }: { projects: Project[] }) {
  const sp = useSearchParams();

  const selectedStatus = sp.get("status") ?? "all";
  const selectedTech = sp.get("tech") ?? "all";
  const selectedSemester = sp.get("semester") ?? "all";

  const allTechs = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.technologies))).sort(),
    [projects]
  );
  const allSemesters = useMemo(
    () => Array.from(new Set(projects.map((p) => p.semester).filter(Boolean) as string[])).sort(),
    [projects]
  );
  const allStatuses = useMemo(
    () => Array.from(new Set(projects.map((p) => p.status))).sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const sOK = selectedStatus === "all" || p.status === selectedStatus;
      const tOK = selectedTech === "all" || p.technologies.includes(selectedTech);
      const semOK = selectedSemester === "all" || p.semester === selectedSemester;
      return sOK && tOK && semOK;
    });
  }, [projects, selectedStatus, selectedTech, selectedSemester]);

  const hrefWith = (s: string, t: string, sem: string) => {
    const qs = new URLSearchParams();
    if (s !== "all") qs.set("status", s);
    if (t !== "all") qs.set("tech", t);
    if (sem !== "all") qs.set("semester", sem);
    const q = qs.toString();
    return q ? `/projects?${q}` : "/projects";
  };

  return (
    <>
      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip label="All status" href={hrefWith("all", selectedTech, selectedSemester)} active={selectedStatus === "all"} />
          {allStatuses.map((s) => (
            <FilterChip key={s} label={s} href={hrefWith(s, selectedTech, selectedSemester)} active={selectedStatus === s} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip label="All tech" href={hrefWith(selectedStatus, "all", selectedSemester)} active={selectedTech === "all"} />
          {allTechs.map((t) => (
            <FilterChip key={t} label={t} href={hrefWith(selectedStatus, t, selectedSemester)} active={selectedTech === t} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip label="All semesters" href={hrefWith(selectedStatus, selectedTech, "all")} active={selectedSemester === "all"} />
          {allSemesters.map((sem) => (
            <FilterChip key={sem} label={sem} href={hrefWith(selectedStatus, selectedTech, sem)} active={selectedSemester === sem} />
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="mt-8">
        {!filtered.length && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>No projects match</CardTitle>
              <CardDescription>
                Try different filters or{" "}
                <Link href="/projects" className="underline">clear filters</Link>.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const img = resolveProjectImage(p);
            return (
              <Link key={p.slug} href={p.readmeUrl || `/projects/${p.slug}`} className="no-underline">
                <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={`${p.title} cover`} className="h-40 w-full object-cover" loading="lazy" />
                  ) : null}
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant={p.status === "Active" ? "default" : p.status === "Completed" ? "secondary" : "outline"}>
                        {p.status}
                      </Badge>
                      {p.semester && <span className="rounded-full border px-2 py-0.5 text-xs">{p.semester}</span>}
                    </div>
                    <CardTitle className="leading-tight">{p.title}</CardTitle>
                    {p.description ? (
                      <CardDescription className="text-base">{p.description}</CardDescription>
                    ) : null}
                  </CardHeader>
                  {!!p.technologies.length && (
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {p.technologies.map((t) => (
                          <Badge key={`${p.slug}-${t}`} variant="outline" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

function FilterChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        active ? "border-primary text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}
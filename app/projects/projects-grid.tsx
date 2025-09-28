// app/projects/projects-grid.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

type Project = {
  slug: string;
  title: string;
  description?: string;
  image?: string;           // filename or absolute URL
  technologies: string[];
  status: "Active" | "Completed" | "Planned";
  semester?: string;
  pm?: string;
  readmeUrl?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export default function ProjectsGrid({ allProjects }: { allProjects: Project[] }) {
  const sp = useSearchParams();
  const status = sp.get("status") ?? "all";
  const tech = sp.get("tech") ?? "all";
  const semester = sp.get("semester") ?? "all";

  // gather filters
  const allStatuses = Array.from(new Set(allProjects.map(p => p.status)));
  const techs = Array.from(new Set(allProjects.flatMap(p => p.technologies))).sort();
  const semesters = Array.from(new Set(allProjects.map(p => p.semester).filter(Boolean) as string[])).sort();

  const byFilters = (p: Project) => {
    const sOK = status === "all" || p.status === status;
    const tOK = tech === "all" || p.technologies.includes(tech);
    const semOK = semester === "all" || p.semester === semester;
    return sOK && tOK && semOK;
  };

  const filtered = allProjects.filter(byFilters);

  const hrefWith = (s: string, t: string, sem: string) => {
    const qs = new URLSearchParams();
    if (s !== "all") qs.set("status", s);
    if (t !== "all") qs.set("tech", t);
    if (sem !== "all") qs.set("semester", sem);
    const q = qs.toString();
    return q ? `/projects?${q}` : "/projects";
  };

  const resolveProjectImage = (p: Project) => {
    const raw = p.image || "";
    if (!raw) return `/projects/${p.slug}/cover.jpg`;      // sensible default
    if (raw.startsWith("http")) return raw;
    // ensure it’s under /public/projects/<slug>/
    const clean = raw.replace(/^\/+/, "");
    return clean.startsWith(`projects/${p.slug}/`)
      ? `/${clean}`
      : `/projects/${p.slug}/${clean}`;
  };

  return (
    <>
      {/* Filters */}
      <section className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip label="All status" href={hrefWith("all", tech, semester)} active={status === "all"} />
          {allStatuses.map((s) => (
            <FilterChip key={s} label={s} href={hrefWith(s, tech, semester)} active={status === s} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip label="All tech" href={hrefWith(status, "all", semester)} active={tech === "all"} />
          {techs.map((t) => (
            <FilterChip key={t} label={t} href={hrefWith(status, t, semester)} active={tech === t} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip label="All semesters" href={hrefWith(status, tech, "all")} active={semester === "all"} />
          {semesters.map((sem) => (
            <FilterChip key={sem} label={sem} href={hrefWith(status, tech, sem)} active={semester === sem} />
          ))}
        </div>
      </section>

      {/* Grid */}
      {!filtered.length ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>No projects match</CardTitle>
            <CardDescription>
              Try a different combination of status/tech/semester or{" "}
              <Link href="/projects" className="underline">clear filters</Link>.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const Icon = (p.icon ?? (() => null)) as React.ComponentType<{ className?: string }>;
            const img = resolveProjectImage(p);
            return (
              <Card key={p.slug} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="aspect-video overflow-hidden">
                  {/* decorative bg image */}
                  <div
                    role="img"
                    aria-label={p.title}
                    className="h-full w-full bg-center bg-cover transition-transform duration-300 group-hover:scale-105 select-none pointer-events-none"
                    style={{ backgroundImage: `url(${img}), url(/projects/logo.png)` }}
                  />
                </div>

                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Icon className="h-6 w-6 text-primary" />
                    <Badge variant={p.status === "Active" ? "default" : p.status === "Completed" ? "secondary" : "outline"}>
                      {p.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{p.title}</CardTitle>
                  {p.description ? <CardDescription className="text-base">{p.description}</CardDescription> : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    {p.pm && <span>{p.pm}</span>}
                    {p.semester && <span className="rounded-full border px-2 py-0.5 text-xs">{p.semester}</span>}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {p.technologies.map((t) => (
                      <Badge key={`${p.slug}-${t}`} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href={p.readmeUrl || `/projects/${p.slug}`}>Read more</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
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
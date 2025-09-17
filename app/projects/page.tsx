// app/projects/page.tsx
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu } from "lucide-react";

import {
  projects,
  allStatuses,
  collectTechs,
  collectSemesters,
  type Project,
} from "./_data";

// --- helpers ---
function byFilters(p: Project, status: string, tech: string, semester: string) {
  const sOK = status === "all" || p.status === status;
  const tOK = tech === "all" || p.technologies.includes(tech);
  const semOK = semester === "all" || p.semester === semester;
  return sOK && tOK && semOK;
}

function ChipLink({ label, href, active }: { label: string; href: string; active: boolean }) {
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

/**
 * Normalize per-project image path.
 * Accepts:
 *  - "cover.jpg"                          -> /projects/<slug>/cover.jpg
 *  - "folder/pic.png"                     -> /projects/<slug>/folder/pic.png
 *  - "/projects/<slug>/cover.jpg"         -> used as-is
 *  - "/anything/else.png" or "http(s)://" -> used as-is
 */
function resolveProjectImage(p: Project) {
  const raw = p.image || "";
  if (!raw) return "/projects/logo.png";
  if (raw.startsWith("http")) return raw;

  // clean leading slash
  let path = raw.replace(/^\/+/, "");

  // strip leading "projects/"
  if (path.startsWith("projects/")) {
    path = path.slice("projects/".length);
  }

  // if already begins with "<slug>/..."
  if (path.startsWith(`${p.slug}/`)) {
    return `/projects/${path}`;
  }

  // otherwise assume it's a filename, drop into slug folder
  return `/projects/${p.slug}/${path}`;
}

// Next 15: searchParams is async
type SearchParamsPromise = Promise<{ status?: string; tech?: string; semester?: string }>;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: SearchParamsPromise;
}) {
  const sp = (await searchParams) ?? {};
  const selectedStatus = (sp.status ?? "all") as "all" | Project["status"];
  const selectedTech = sp.tech ?? "all";
  const selectedSemester = sp.semester ?? "all";

  const techs = collectTechs(projects);
  const semesters = collectSemesters(projects);

  const filtered = projects.filter((p) => byFilters(p, selectedStatus, selectedTech, selectedSemester));

  const hrefWith = (s: string, t: string, sem: string) => {
    const qs = new URLSearchParams();
    if (s !== "all") qs.set("status", s);
    if (t !== "all") qs.set("tech", t);
    if (sem !== "all") qs.set("semester", sem);
    const q = qs.toString();
    return q ? `/projects?${q}` : "/projects";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <Badge variant="secondary" className="mx-auto mb-6 w-fit">
            <Cpu className="mr-2 h-4 w-4" />
            Student Projects
          </Badge>
          <h1 className="text-balance mb-6 text-4xl font-bold leading-tight lg:text-6xl">
            Our <span className="text-primary">Projects</span>
          </h1>
          <p className="text-pretty mx-auto max-w-3xl text-xl text-muted-foreground leading-relaxed">
            Hands-on teams building drones, DSP on FPGA, HIL rigs, robotics, accessibility tech, and the club’s digital platform.
          </p>

          {/* Filters */}
          <div className="mt-8 space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <ChipLink label="All status" href={hrefWith("all", selectedTech, selectedSemester)} active={selectedStatus === "all"} />
              {allStatuses.map((s) => (
                <ChipLink key={`status-${s}`} label={s} href={hrefWith(s, selectedTech, selectedSemester)} active={selectedStatus === s} />
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <ChipLink label="All tech" href={hrefWith(selectedStatus, "all", selectedSemester)} active={selectedTech === "all"} />
              {techs.map((t) => (
                <ChipLink key={`tech-${t}`} label={t} href={hrefWith(selectedStatus, t, selectedSemester)} active={selectedTech === t} />
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <ChipLink label="All semesters" href={hrefWith(selectedStatus, selectedTech, "all")} active={selectedSemester === "all"} />
              {semesters.map((sem) => (
                <ChipLink key={`sem-${sem}`} label={sem} href={hrefWith(selectedStatus, selectedTech, sem)} active={selectedSemester === sem} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          {!filtered.length && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>No projects match</CardTitle>
                <CardDescription>
                  Try a different combination of status/tech/semester or{" "}
                  <Link href="/projects" className="underline">clear filters</Link>.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const Icon = p.icon as React.ComponentType<{ className?: string }>;
              const img = resolveProjectImage(p);

              return (
                <Card key={p.slug} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">

                  <div className="aspect-video overflow-hidden">
                    {/* not clickable */}
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
                    <CardDescription className="text-base">{p.description}</CardDescription>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
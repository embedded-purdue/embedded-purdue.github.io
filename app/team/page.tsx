import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Linkedin, Github, Users, Shield } from "lucide-react"
import type { ComponentType, SVGProps } from "react"
import { Footer } from "@/components/footer"
import Image from "next/image"

type Member = {
  name: string
  role: string
  email?: string
  linkedin?: string
  github?: string
  image?: string
  tags?: string[]
}
const FALLBACK_IMG = "/team/logo.png";
type Section = {
  title: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  members: Member[]
}
// Put this near the top of the file (outside the component):
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjMwIiByeD0iNiIgZmlsbD0iI2IyYjJiMiIvPjwvc3ZnPg==";
/* ---------- PEOPLE (define these BEFORE sections) ---------- */
const executives: Member[] = [
  {
    name: "Alex Aylward",
    role: "President",
    image: "/team/alex.jpeg",
    email: "mailto:alex@purdue.edu",
    linkedin: "https://www.linkedin.com/in/alexaylward",
  },
  {
    name: "Trevor Antle",
    role: "Vice President",
    image: "/team/trevor.jpg",
    email: "mailto:trevor@purdue.edu",
    linkedin: "https://www.linkedin.com/in/trevor-antle",
  },
  {
    name: "Aakash Bathini",
    role: "Treasurer",
    image: "/team/aakash.jpg",
    email: "mailto:aakash@purdue.edu",
    linkedin: "https://www.linkedin.com/in/aakashbathini",
  },
  {
    name: "Connor Powell",
    role: "Projects Manager",
    image: "/team/connor.jpg",
    email: "mailto:connor@purdue.edu",
    linkedin: "https://www.linkedin.com/in/connorpowell",
  },
  {
    name: "Neal Singh",
    role: "Professional Development",
    image: "/team/neal.jpg",
    email: "mailto:neal@purdue.edu",
    linkedin: "https://www.linkedin.com/in/nealsingh",
  },
]

const chairs: Member[] = [
  {
    name: "Astha Patel",
    role: "Social Media Chair",
    image: "/team/logo.png",
  },
  {
    name: "Carson Weiler",
    role: "Graphics Designer",
    image: "/team/logo.png",
  },
  {
    name: "Geuntae",
    role: "Photographer",
    image: "/team/logo.png",
  },
  {
    name: "Jain Iftesam",
    role: "Marketing Chair",
    image: "/team/jain.jpeg",
  },
  {
    name: "Patrick Jordan",
    role: "Fundraisin Chair",
    image: "/team/logo.png",
  },
  {
    name: "Peter Konst",
    role: "Outreach Chair",
    image: "/team/logo.png",
  },
  {
    name: "Srihari CS",
    role: "Fundraising CHair",
    image: "/team/logo.png",
  },
  {
    name: "Tom Concannon",
    role: "Events Chair",
    image: "/team/tom.jpg",
  },
]

const projectManagers: Member[] = [
  {
    name: "Tim Ausec",
    role: "PM • Agrovolo",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    image: "/team/logo.png",
    tags: ["Control", "RF"],
  },
  {
    name: "Connor Powell",
    role: "PM • BerryWeather",
    linkedin: "https://www.linkedin.com/",
    image: "/team/connor.jpg",
    tags: ["Sensors", "Power"],
  },
  {
    name: "Varun",
    role: "PM • HarmoniCore (FPGA DSP)",
    github: "https://github.com/",
    image: "/team/logo.png",
    tags: ["FPGA", "DSP"],
  },
  {
    name: "Katherine M",
    role: "PM • EyeCue",
    linkedin: "https://www.linkedin.com/",
    image: "/team/logo.png",
    tags: ["CV", "Accessibility"],
  },
]

/* ---------- SECTIONS (now safe) ---------- */
const sections: Section[] = [
  { title: "Executive Board", icon: Shield, members: executives },
  { title: "Chairs", icon: Users, members: chairs },
  { title: "Project Managers", icon: Users, members: projectManagers },
]

/* ---------- UI ---------- */
function MemberCard({ m }: { m: Member }) {
  const src = m.image || "/team/logo.png";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {/* Portrait media box */}
      <div className="relative aspect-[4/5] bg-muted/50 border-b">
        <Image
          src={src}
          alt={m.name}
          fill
          // Portraits: keep heads in frame
          className="object-cover object-top"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          // Nice perceived loading
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          priority={false}
        />
      </div>

      <CardHeader>
        <CardTitle className="text-lg">{m.name}</CardTitle>
        <CardDescription>{m.role}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {m.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {m.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="flex gap-3">
          {m.email && (
            <a
              href={m.email}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Email ${m.name}`}
            >
              <Mail className="h-5 w-5" />
            </a>
          )}
          {m.linkedin && (
            <a
              href={m.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label={`${m.name} on LinkedIn`}
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {m.github && (
            <a
              href={m.github}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label={`${m.name} on GitHub`}
            >
              <Github className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="w-fit mx-auto mb-6">
            <Users className="w-4 h-4 mr-2" />
            Our Team
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight mb-6">
            Meet the <span className="text-primary">Executive Team</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
            Execs, admins, and project managers who keep Embedded Systems @ Purdue running.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          {sections.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.title}>
                <div className="mb-6 flex items-center gap-3">
                  <Icon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">{s.title}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {s.members.map((m) => (
                    <MemberCard key={`${s.title}-${m.name}`} m={m} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
      <Footer />

    </div>
  )
}
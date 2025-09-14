import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Linkedin, Github, Users, Shield } from "lucide-react"
import type { ComponentType, SVGProps } from "react"

type Member = {
  name: string
  role: string
  email?: string
  linkedin?: string
  github?: string
  image?: string
  tags?: string[]
}

type Section = {
  title: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  members: Member[]
}

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
    linkedin: "https://www.linkedin.com/in/trevorantle",
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
    image: "/team/neal.jpeg",
    email: "mailto:neal@purdue.edu",
    linkedin: "https://www.linkedin.com/in/nealsingh",
  },
]

const chairs: Member[] = [
  {
    name: "Jain Iftesam",
    role: "Public Relations Chair",
    image: "/team/jain.jpeg",
    email: "mailto:jain@purdue.edu",
    linkedin: "https://www.linkedin.com/in/jainiftesam",
  },
  {
    name: "Tom Concannon",
    role: "Events Chair",
    image: "/team/tom.jpg",
    email: "mailto:tom@purdue.edu",
    linkedin: "https://www.linkedin.com/in/tomconcannon",
  },
]

const projectManagers: Member[] = [
  {
    name: "Tim Ausec",
    role: "PM • Agrovolo",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    image: "/team/tim.jpg",
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
    image: "/team/varun.jpg",
    tags: ["FPGA", "DSP"],
  },
  {
    name: "Katherine M",
    role: "PM • EyeCue",
    linkedin: "https://www.linkedin.com/",
    image: "/team/katherine.jpg",
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
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-[5/3] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.image || "/placeholder.svg"} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
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

        {/* icon row */}
        <div className="flex gap-3">
          {m.email && (
            <a href={m.email} className="text-muted-foreground hover:text-foreground" aria-label={`Email ${m.name}`}>
              <Mail className="w-5 h-5" />
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
              <Linkedin className="w-5 h-5" />
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
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
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
            Meet the <span className="text-primary">Leads & Mentors</span>
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
    </div>
  )
}
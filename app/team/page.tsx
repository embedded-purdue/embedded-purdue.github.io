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
    name: "Thomas Concannon",
    role: "President",
    linkedin: "https://www.linkedin.com/in/thomascon/",
    tags: [],
    image: "/team/thomas.jpg"
  },
  {
    name: "Aakash Bathini",
    role: "Vice President",
    linkedin: "https://www.linkedin.com/in/aakashbathini/",
    tags: [],
    image: "/team/aakash.jpg"
  },
  {
    name: "Patrick Jordan",
    role: "Treasurer",
    tags: [],
    image: "/team/patrick.jpg"
  },
  {
    name: "Ryan Wurtz",
    role: "Executive Software Engineer",
    linkedin: "https://www.linkedin.com/in/ryan-wurtz/",
    tags: [],
    image: "/team/ryan.jpg"
  },
  {
    name: "Connor Powell",
    role: "Executive Hardware Engineer",
    linkedin: "https://www.linkedin.com/in/connorzanepowell/",
    tags: [],
    image: "/team/connor.jpg"
  }
];


const chairs: Member[] = [
  {
    name: "Arman Islam",
    role: "Outreach Director",
    linkedin: "https://www.linkedin.com/in/armanislam2007/",
    tags: [],
    image: "/team/arman.jpg"
  },
  {
    name: "Astha Patel",
    role: "Public Relations Director",
    linkedin: "https://www.linkedin.com/in/astha-p/",
    tags: [],
    image: "/team/astha.jpg"
  },
  {
    name: "Benji Emini",
    role: "Workshops Director",
    linkedin: "https://www.linkedin.com/in/benjamin-emini/",
    tags: [],
    image: "/team/benji.jpg"
  },
  {
    name: "Gillian Hanley",
    role: "Web Director",
    linkedin: "https://www.linkedin.com/in/gillian-hanley-a77024242/",
    tags: [],
    image: "/team/gillian.jpg"
  },
  {
    name: "Magdalena Gonzalez Navarrine",
    role: "Events Director",
    tags: [],
    image: "/team/magdalena.jpg"
  },
  {
    name: "Anish Sarkar",
    role: "Photographer",
    tags: [],
    image: "/team/anish.jpg"
  },
];


const projectManagers: Member[] = [
  // BB-8
  {
    name: "Hayden Logan",
    role: "PM • BB-8",
    linkedin: "https://linkedin.com/in/hayden-logan-2a539a261",
    tags: [],
    image: "/team/hayden.jpg"
  },

  // Embedded Tetris
  {
    name: "Mahdi El Husseini",
    role: "PM • Embedded Tetris",
    linkedin: "https://www.linkedin.com/in/mahdi-el-husseini",
    image: "/team/mahdi.jpg",
    tags: [],
  },
  {
    name: "Sabastian Hamilton",
    role: "PM • Embedded Tetris",
    linkedin: "https://www.linkedin.com/in/sabastianhamilton",
    image: "/team/sabastian.jpg",
    tags: [],
  },

  // EyeCue
  {
    name: "Aarushi Deshwal",
    role: "PM • EyeCue",
    linkedin: "https://www.linkedin.com/in/aarushi-deshwal-42450b328/",
    image: "/team/aarushi.jpg",
    tags: [],
  },
  {
    name: "Garima Thapliyal",
    role: "PM of Eyecue",
    linkedin: "https://www.linkedin.com/in/garimat9606",
    tags: [],
    image: "/team/garima.jpg"
  },
  {
    name: "Katherine Ma",
    role: "PM • EyeCue",
    image: "/team/katherine.jpg",
    tags: [],
  },
  {
    name: "Shruthi Arunkumar",
    role: "PM • EyeCue",
    linkedin: "https://www.linkedin.com/in/shruthi-arunkumar",
    image: "/team/shruthi.jpg",
    tags: [],
  },

  // HarmoniCore
  {
    name: "Sam Morales",
    role: "PM • HarmoniCore",
    linkedin: "https://www.linkedin.com/in/samorales03/",
    image: "/team/samuel.jpg",
    tags: [],
  },

  // Holo-Adapt
  {
    name: "Neal Singh",
    role: "PM • Holo-Adapt",
    linkedin: "https://www.linkedin.com/in/neal-ssingh",
    tags: [],
    image: "/team/neal.jpg"
  },

  // MicroPiano
  {
    name: "Alex Forrest",
    role: "PM • MicroPiano",
    linkedin: "https://www.linkedin.com/in/alex-forrest-ee/",
    image: "/team/alex.jpg",
    tags: [],
  },
  {
    name: "Alexander Rizzi",
    role: "PM • MicroPiano",
    linkedin: "https://www.linkedin.com/in/alexander-rizzi/",
    image: "/team/alexander.jpg",
    tags: [],
  },

  // SlayterHIL
  {
    name: "Amber Khauv",
    role: "PM • SlayterHIL",
    linkedin: "https://www.linkedin.com/in/akkhauv/",
    // image: "/team/amber.jpg",
    tags: [],
  },
  {
    name: "Nikhil Chaudhary",
    role: "PM • SlayterHIL",
    linkedin: "https://www.linkedin.com/in/nikhilmchaudhary/",
    tags: [],
    image: "/team/nikhil.jpg"
  }
];



/* ---------- SECTIONS (now safe) ---------- */
const sections: Section[] = [
  { title: "Executive Board", icon: Shield, members: executives },
  { title: "Chairs", icon: Users, members: chairs },
  { title: "Project Managers", icon: Users, members: projectManagers },
]

/* ---------- UI ---------- */
function MemberCard({ m }: { m: Member }) {
  const src = m.image ? m.image : "/team/logo.png";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {/* Portrait media box */}
      <div className="relative aspect-[5/5] bg-muted/50 border-b">
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
        <div className="max-w-7xl mx-auto space-y-16 p-14">
          {sections.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.title}>
                <div className="mb-6 flex items-center gap-3">
                  <Icon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">{s.title}</h2>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
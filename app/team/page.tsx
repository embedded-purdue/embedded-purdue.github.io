import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Github, Users, Shield } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Footer } from "@/components/footer";
import Image, { StaticImageData } from "next/image";
import React from "react";

// Import all images as static imports - I know this is ugly asf
// but it is a temporary solution since dynamic imports were very slow
import thomasImg from "../../public/team/thomas.jpg";
import aakashImg from "../../public/team/aakash.jpg";
import patrickImg from "../../public/team/patrick.jpg";
import ryanImg from "../../public/team/ryan.jpg";
import connorImg from "../../public/team/connor.jpg";
import armanImg from "../../public/team/arman.jpg";
import asthaImg from "../../public/team/astha.jpg";
import benjiImg from "../../public/team/benji.jpg";
import gillianImg from "../../public/team/gillian.jpg";
import magdalenaImg from "../../public/team/magdalena.jpg";
import anishImg from "../../public/team/anish.jpg";
import haydenImg from "../../public/team/hayden.jpg";
import mahdiImg from "../../public/team/mahdi.jpg";
import sabastianImg from "../../public/team/sabastian.jpg";
import aarushiImg from "../../public/team/aarushi.jpg";
import garimaImg from "../../public/team/garima.jpg";
import katherineImg from "../../public/team/katherine.jpg";
import shruthiImg from "../../public/team/shruthi.jpg";
import samuelImg from "../../public/team/samuel.jpg";
import nealImg from "../../public/team/neal.jpg";
import alexImg from "../../public/team/alex.jpg";
import alexanderImg from "../../public/team/alexander.jpg";
import nikhilImg from "../../public/team/nikhil.jpg";

type Member = {
  name: string;
  role: string;
  email?: string;
  linkedin?: string;
  github?: string;
  image?: StaticImageData; // Use StaticImageData for imported images
  tags?: string[];
};

type Section = {
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  members: Member[];
};

const FALLBACK_IMG = "/team/logo.png";

/* ---------- PEOPLE ---------- */
const executives: Member[] = [
  { name: "Thomas Concannon", role: "President", linkedin: "https://www.linkedin.com/in/thomascon/", tags: [], image: thomasImg },
  { name: "Aakash Bathini", role: "Vice President", linkedin: "https://www.linkedin.com/in/aakashbathini/", tags: [], image: aakashImg },
  { name: "Patrick Jordan", role: "Treasurer", tags: [], image: patrickImg },
  { name: "Ryan Wurtz", role: "Executive Software Engineer", linkedin: "https://www.linkedin.com/in/ryan-wurtz/", tags: [], image: ryanImg },
  { name: "Connor Powell", role: "Executive Hardware Engineer", linkedin: "https://www.linkedin.com/in/connorzanepowell/", tags: [], image: connorImg },
];

const chairs: Member[] = [
  { name: "Arman Islam", role: "Outreach Director", linkedin: "https://www.linkedin.com/in/armanislam2007/", tags: [], image: armanImg },
  { name: "Astha Patel", role: "Public Relations Director", linkedin: "https://www.linkedin.com/in/astha-p/", tags: [], image: asthaImg },
  { name: "Benji Emini", role: "Workshops Director", linkedin: "https://www.linkedin.com/in/benjamin-emini/", tags: [], image: benjiImg },
  { name: "Gillian Hanley", role: "Web Director", linkedin: "https://www.linkedin.com/in/gillian-hanley-a77024242/", tags: [], image: gillianImg },
  { name: "Magdalena Gonzalez Navarrine", role: "Events Director", tags: [], image: magdalenaImg },
  { name: "Anish Sarkar", role: "Photographer", tags: [], image: anishImg },
];

const projectManagers: Member[] = [
  { name: "Hayden Logan", role: "PM • BB-8", linkedin: "https://linkedin.com/in/hayden-logan-2a539a261", tags: [], image: haydenImg },
  { name: "Mahdi El Husseini", role: "PM • Embedded Tetris", linkedin: "https://www.linkedin.com/in/mahdi-el-husseini", image: mahdiImg, tags: [] },
  { name: "Sabastian Hamilton", role: "PM • Embedded Tetris", linkedin: "https://www.linkedin.com/in/sabastianhamilton", image: sabastianImg, tags: [] },
  { name: "Aarushi Deshwal", role: "PM • EyeCue", linkedin: "https://www.linkedin.com/in/aarushi-deshwal-42450b328/", image: aarushiImg, tags: [] },
  { name: "Garima Thapliyal", role: "PM • EyeCue", linkedin: "https://www.linkedin.com/in/garimat9606", image: garimaImg, tags: [] },
  { name: "Katherine Ma", role: "PM • EyeCue", image: katherineImg, tags: [] },
  { name: "Shruthi Arunkumar", role: "PM • EyeCue", linkedin: "https://www.linkedin.com/in/shruthi-arunkumar", image: shruthiImg, tags: [] },
  { name: "Sam Morales", role: "PM • HarmoniCore", linkedin: "https://www.linkedin.com/in/samorales03/", image: samuelImg, tags: [] },
  { name: "Neal Singh", role: "PM • Holo-Adapt", linkedin: "https://www.linkedin.com/in/neal-ssingh", image: nealImg, tags: [] },
  { name: "Alex Forrest", role: "PM • MicroPiano", linkedin: "https://www.linkedin.com/in/alex-forrest-ee/", image: alexImg, tags: [] },
  { name: "Alexander Rizzi", role: "PM • MicroPiano", linkedin: "https://www.linkedin.com/in/alexander-rizzi/", image: alexanderImg, tags: [] },
  { name: "Nikhil Chaudhary", role: "PM • SlayterHIL", linkedin: "https://www.linkedin.com/in/nikhilmchaudhary/", image: nikhilImg, tags: [] },
];

/* ---------- SECTIONS ---------- */
const sections: Section[] = [
  { title: "Executive Board", icon: Shield, members: executives },
  { title: "Chairs", icon: Users, members: chairs },
  { title: "Project Managers", icon: Users, members: projectManagers },
];

/* ---------- UI ---------- */
const MemberCard = React.memo(({ m }: { m: Member }) => {
  const src = m.image || FALLBACK_IMG;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-[3/4] bg-muted/50 border-b">
        <Image
          src={src}
          alt={m.name}
fill
          className="object-cover object-top"
          placeholder="blur"
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
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        ) : null}

        <div className="flex gap-3">
          {m.email && <a href={m.email} className="text-muted-foreground hover:text-foreground" aria-label={`Email ${m.name}`}><Mail className="h-5 w-5" /></a>}
          {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label={`${m.name} on LinkedIn`}><Linkedin className="h-5 w-5" /></a>}
          {m.github && <a href={m.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label={`${m.name} on GitHub`}><Github className="h-5 w-5" /></a>}
        </div>
      </CardContent>
    </Card>
  );
});

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
            const Icon = s.icon;
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
  );
}

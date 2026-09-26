import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  CircuitBoard,
  Cpu,
  Github,
  Linkedin,
  Mail,
  Network,
  Radio,
  Shield,
  Trophy,
  Users,
  Wrench,
} from "lucide-react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"

import armanImg from "../../public/team/arman.jpg"
import asthaImg from "../../public/team/astha.jpg"
import patrickImg from "../../public/team/patrick.jpg"
import gautamImg from "../../public/team/gautam.jpg"
import mahdiImg from "../../public/team/mahdi.jpg"
import benjiImg from "../../public/team/benji.jpg"
import gillianImg from "../../public/team/gillian.jpg"
import magdalenaImg from "../../public/team/magdalena.jpg"
import anishImg from "../../public/team/anish.jpg"
import haydenImg from "../../public/team/hayden.jpg"
import sabastianImg from "../../public/team/sabastian.jpg"
import aarushiImg from "../../public/team/aarushi.jpg"
import garimaImg from "../../public/team/garima.jpg"
import katherineImg from "../../public/team/katherine.jpg"
import shruthiImg from "../../public/team/shruthi.jpg"
import samuelImg from "../../public/team/samuel.jpg"
import nealImg from "../../public/team/neal.jpg"
import alexImg from "../../public/team/alex.jpg"
import alexanderImg from "../../public/team/alexander.jpg"
import nikhilImg from "../../public/team/nikhil.jpg"

const WIDE_RAIL = "site-rail mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

type Member = {
  name: string
  role: string
  email?: string
  linkedin?: string
  github?: string
  image?: StaticImageData
}

const executives: Member[] = [
  { name: "Arman Islam", role: "President", linkedin: "https://www.linkedin.com/in/thomascon/", image: armanImg },
  { name: "Astha Patel", role: "Vice President", linkedin: "https://www.linkedin.com/in/astha-p/", image: asthaImg },
  { name: "Patrick Jordan", role: "Treasurer", image: patrickImg },
  { name: "Gautam Aravindan", role: "Development Engineer", linkedin: "https://www.linkedin.com/in/gautamaravindan/", image: gautamImg },
  { name: "Mahdi El Husseini", role: "Executive Engineer", linkedin: "https://www.linkedin.com/in/mahdi-el-husseini/", image: mahdiImg },
]

// Chairs and Project Managers share one section on the page.
const chairsAndPMs: Member[] = [
  { name: "Benji Emini", role: "Workshops Director", linkedin: "https://www.linkedin.com/in/benjamin-emini/", image: benjiImg },
  { name: "Gillian Hanley", role: "Web Director", linkedin: "https://www.linkedin.com/in/gillian-hanley-a77024242/", image: gillianImg },
  { name: "Magdalena Gonzalez Navarrine", role: "Events Director", image: magdalenaImg },
  { name: "Anish Sarkar", role: "Photographer", linkedin: "https://www.linkedin.com/in/sarkar-anish/", image: anishImg },
  { name: "Hayden Logan", role: "PM • BB-8", linkedin: "https://linkedin.com/in/hayden-logan-2a539a261", image: haydenImg },
  { name: "Sabastian Hamilton", role: "PM • Embedded Tetris", linkedin: "https://www.linkedin.com/in/sabastianhamilton", image: sabastianImg },
  { name: "Aarushi Deshwal", role: "PM • EyeCue", linkedin: "https://www.linkedin.com/in/aarushi-deshwal-42450b328/", image: aarushiImg },
  { name: "Garima Thapliyal", role: "PM • EyeCue", linkedin: "https://www.linkedin.com/in/garimat9606", image: garimaImg },
  { name: "Katherine Ma", role: "PM • EyeCue", linkedin: "https://www.linkedin.com/in/katheriinema/", image: katherineImg },
  { name: "Shruthi Arunkumar", role: "PM • EyeCue", linkedin: "https://www.linkedin.com/in/shruthi-arunkumar", image: shruthiImg },
  { name: "Sam Morales", role: "PM • HarmoniCore", linkedin: "https://www.linkedin.com/in/samorales03/", image: samuelImg },
  { name: "Neal Singh", role: "PM • Holo-Adapt", linkedin: "https://www.linkedin.com/in/neal-ssingh", image: nealImg },
  { name: "Alex Forrest", role: "PM • MicroPiano", linkedin: "https://www.linkedin.com/in/alex-forrest-ee/", image: alexImg },
  { name: "Alexander Rizzi", role: "PM • MicroPiano", linkedin: "https://www.linkedin.com/in/alexander-rizzi/", image: alexanderImg },
  { name: "Nikhil Chaudhary", role: "PM • SlayterHIL", linkedin: "https://www.linkedin.com/in/nikhilmchaudhary/", image: nikhilImg },
]

const mission = [
  {
    index: "01",
    title: "Hands-on learning",
    detail: "Turn embedded systems concepts into working hardware through technical projects and hands-on debugging.",
    icon: CircuitBoard,
  },
  {
    index: "02",
    title: "Engineering community",
    detail: "Work alongside students who care about hardware, firmware, systems, and the craft of making them work together.",
    icon: Users,
  },
  {
    index: "03",
    title: "Professional growth",
    detail: "Build technical depth while meeting alumni, industry engineers, and researchers.",
    icon: Cpu,
  },
]

const activities = [
  {
    index: "A01",
    title: "Technical workshops",
    detail: "Microcontrollers, RTOS, debugging, PCB design, and the tools we actually use to build embedded systems.",
    icon: Wrench,
  },
  {
    index: "A02",
    title: "Project teams",
    detail: "Build complete systems across robotics, sensing, controls, and custom hardware.",
    icon: CircuitBoard,
  },
  {
    index: "A03",
    title: "Speaker events",
    detail: "Learn from engineers and technical leaders working across embedded systems and adjacent industries.",
    icon: Radio,
  },
  {
    index: "A04",
    title: "Competitions",
    detail: "Test systems under tight constraints through national events, hackathons, and internal engineering challenges.",
    icon: Trophy,
  },
  {
    index: "A05",
    title: "Mentorship",
    detail: "Get technical advice, project guidance, and career context from experienced members and mentors.",
    icon: Network,
  },
]

const reasons = [
  "Build a portfolio of embedded projects that proves you can ship hardware.",
  "Your skills will transfer straight into engineering teams and research labs.",
  "Find collaborators who care about hardware and low-level software as much as you do.",
  "Get access to internal opportunities, alumni connections, and a stronger network.",
]

function SignalLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#aaa398]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
      <span>{children}</span>
    </div>
  )
}

function MemberPortrait({ member, index, prefix = "E" }: { member: Member; index: number; prefix?: string }) {
  const socialLinkClass =
    "grid h-10 w-10 shrink-0 place-items-center border border-white/[0.12] text-[#aaa398] transition-colors hover:border-[#daa000]/50 hover:text-[#f2c34f]"

  return (
    <article className="min-w-0">
      <div className="relative flex aspect-[2/3] items-center justify-center overflow-hidden bg-[#151513]">
        {member.image && (
          <Image
            src={member.image}
            alt={member.name}
            width={member.image.width}
            height={member.image.height}
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 20vw"
            className={`block h-auto max-h-full w-full object-contain ${member.image.width < 200 ? "max-w-[190px]" : ""}`}
          />
        )}
      </div>
      <div className="border-t border-white/[0.1] pt-5">
        <p className="font-mono text-[0.62rem] uppercase leading-5 tracking-[0.12em] text-[#c39b36]">{member.role}</p>
        <h3 className="mt-2 text-[clamp(1.15rem,1.7vw,1.65rem)] font-medium leading-tight tracking-[-0.035em] text-[#eee8de]">{member.name}</h3>
        <div className="mt-4 flex min-h-10 items-center justify-between gap-2">
          <span className="font-mono text-[0.56rem] tracking-[0.14em] text-[#716b62]">{prefix}-{String(index + 1).padStart(2, "0")}</span>
          <div className="flex gap-2">
            {member.email && <a href={member.email} aria-label={`Email ${member.name}`} className={socialLinkClass}><Mail className="h-4 w-4" aria-hidden="true" /></a>}
            {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`} className={socialLinkClass}><Linkedin className="h-4 w-4" aria-hidden="true" /></a>}
            {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on GitHub`} className={socialLinkClass}><Github className="h-4 w-4" aria-hidden="true" /></a>}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main data-site-main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="flex min-h-[430px] flex-col justify-between border-b border-white/[0.08] px-5 py-9 sm:px-8 sm:py-10 lg:col-span-7 lg:min-h-[520px] lg:border-b-0 lg:border-r lg:px-12 lg:py-11 xl:px-16">
                <div className="flex items-center justify-between gap-4">
                  <SignalLabel>About ES@P</SignalLabel>
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#55524d]">
                    West Lafayette · Indiana
                  </span>
                </div>

                <div className="max-w-4xl py-9 lg:py-10">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.19em] text-[#6f6a62]">Student organization / embedded systems</p>
                  <h1 className="mt-4 text-[clamp(3.6rem,7.4vw,7.6rem)] font-medium leading-[0.82] tracking-[-0.07em] text-[#f3efe6]">
                    Build the
                    <span className="block text-[#d8aa27]">whole system</span>
                  </h1>
                  <p className="mt-6 max-w-2xl text-[clamp(1rem,1.25vw,1.2rem)] leading-8 text-[#989289]">
                    Embedded Systems @ Purdue is a student organization built around learning by doing: hardware,
                    firmware, controls, and systems engineering coming together in projects that actually have to work.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="https://discord.gg/MkPv9s9cj3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-11 items-center gap-3 bg-[#daa000] px-5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#11110f] transition-colors hover:bg-[#f0bd31]"
                  >
                    Join ES@P
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/projects"
                    className="group inline-flex h-11 items-center gap-3 border border-white/[0.12] px-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#c7c0b5] transition-colors hover:border-[#daa000]/45 hover:text-[#f2c34f]"
                  >
                    View projects
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[390px] overflow-hidden lg:col-span-5 lg:min-h-[520px]">
                <Image
                  src="/site-media/about-founders.webp"
                  alt="Embedded Systems @ Purdue members"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover opacity-[0.76]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/28" />
                <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 border-t border-white/[0.12] bg-black/90">
                  <div className="border-r border-white/[0.1] px-5 py-4 sm:px-7">
                    <p className="font-mono text-[0.54rem] uppercase tracking-[0.17em] text-[#6f6a62]">Community</p>
                    <p className="mt-1.5 text-2xl font-medium tracking-[-0.04em] text-[#f0ece2]">100+ members</p>
                  </div>
                  <div className="px-5 py-4 sm:px-7">
                    <p className="font-mono text-[0.54rem] uppercase tracking-[0.17em] text-[#6f6a62]">Focus</p>
                    <p className="mt-1.5 text-2xl font-medium tracking-[-0.04em] text-[#f0ece2]">Build + learn</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-6 border-b border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-14 xl:px-16">
              <div>
                <SignalLabel>01 / Mission</SignalLabel>
                <h2 className="mt-3 text-[clamp(2.6rem,4.6vw,4.9rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                  Learn by building
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#817c73]">
                ES@P makes embedded engineering tangible: design it, wire it, flash it, debug it, and understand why it works.
              </p>
            </div>

            <div className="grid gap-px bg-white/[0.08] md:grid-cols-3">
              {mission.map((item) => {
                const Icon = item.icon
                return (
                  <article
                    key={item.index}
                    data-site-lift="card"
                    className="group min-h-[270px] bg-[#0c0c0b] px-5 py-8 transition-colors hover:bg-[#11110f] sm:px-8 lg:px-9 lg:py-9"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[0.57rem] uppercase tracking-[0.17em] text-[#68645d]">{item.index}</span>
                      <Icon className="h-5 w-5 text-[#9d7b1f] transition-colors group-hover:text-[#e0ad27]" aria-hidden="true" />
                    </div>
                    <h3 className="mt-12 text-2xl font-medium tracking-[-0.045em] text-[#ece7dc]">{item.title}</h3>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-[#827d74]">{item.detail}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-6 border-b border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-14 xl:px-16">
              <div>
                <SignalLabel>02 / What we do</SignalLabel>
                <h2 className="mt-3 text-[clamp(2.7rem,4.7vw,5rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                  Build it with a team
                </h2>
              </div>
              <p className="max-w-lg text-sm leading-6 text-[#817c73]">
                Learn a system, build a system, explain a system, then help someone else do the same. That's the whole club.
              </p>
            </div>

            <div className="grid gap-px bg-white/[0.08] sm:grid-cols-2 xl:grid-cols-5">
              {activities.map((item) => {
                const Icon = item.icon
                return (
                  <article
                    key={item.index}
                    data-site-lift="card"
                    className="group flex min-h-[250px] flex-col bg-black px-5 py-8 transition-colors hover:bg-[#0c0c0b] sm:px-7 sm:max-xl:last:col-span-2 sm:max-xl:last:min-h-0 lg:py-9"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.54rem] uppercase tracking-[0.16em] text-[#5f5b55]">{item.index}</span>
                      <Icon className="h-4.5 w-4.5 text-[#766021] transition-colors group-hover:text-[#daa000]" aria-hidden="true" />
                    </div>
                    <div className="mt-auto pt-12 group-last:sm:max-xl:pt-7">
                      <h3 className="text-xl font-medium tracking-[-0.04em] text-[#e9e4da]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#777169]">{item.detail}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="relative min-h-[330px] overflow-hidden border-b border-white/[0.08] bg-black lg:col-span-5 lg:min-h-[430px] lg:border-b-0 lg:border-r">
                <Image
                  src="/site-media/about-bb8.webp"
                  alt="ES@P project hardware"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover opacity-[0.74]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/10 to-black/24" />
                <div className="absolute inset-x-0 bottom-0 px-5 py-6 sm:px-8 lg:px-10">
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.16em] text-[#8d7328]">03 / Why join</p>
                  <p className="mt-2 max-w-sm text-xl font-medium leading-7 tracking-[-0.035em] text-[#e5dfd5]">
                    Your projects are your résumé
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="border-b border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
                  <h2 className="max-w-3xl text-[clamp(2.8rem,4.8vw,5.2rem)] font-medium leading-[0.88] tracking-[-0.065em]">
                    Get better by shipping
                  </h2>
                </div>
                {reasons.map((reason, index) => (
                  <div key={reason} className="grid min-h-[104px] grid-cols-[50px_1fr] border-b border-white/[0.08] px-5 py-6 last:border-b-0 sm:grid-cols-[76px_1fr] sm:px-8 lg:min-h-[116px] lg:items-center lg:px-10 lg:py-7">
                    <span className="font-mono text-[0.55rem] tracking-[0.17em] text-[#5f5b55]">0{index + 1}</span>
                    <p className="max-w-2xl text-lg leading-7 tracking-[-0.025em] text-[#c4beb4]">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="team" className="border-b border-white/[0.08] bg-[#0c0c0b] scroll-mt-20">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-6 border-b border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-14 xl:px-16">
              <div>
                <SignalLabel>04 / Team</SignalLabel>
                <h2 className="mt-3 text-[clamp(2.6rem,4.6vw,4.9rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                  The people<br /><span className="text-[#d8aa27]">behind the systems</span>
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#817c73]">
                Students keeping ES@P organized, technically ambitious, and actually shipping hardware.
              </p>
            </div>

            <div className="px-5 pb-10 sm:px-8 sm:pb-12 lg:px-12 xl:px-16">
              <div className="flex flex-wrap items-center justify-between gap-4 py-7 sm:py-8">
                <h3 className="text-2xl font-medium tracking-[-0.04em] text-[#ebe6dc]">Executive Board</h3>
                <span className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#81796b]"><Shield className="h-3.5 w-3.5" aria-hidden="true" />{executives.length} executives / 2026</span>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-6 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-5 xl:gap-x-7">
                {executives.map((member, index) => (
                  <div key={member.name} className={`${index === executives.length - 1 ? "col-span-2 mx-auto w-[calc(50%_-_10px)] sm:col-span-3 sm:mx-0 sm:w-auto" : "sm:col-span-2"} ${index === 3 ? "sm:col-span-3" : ""} lg:col-span-1 lg:mx-0 lg:w-auto`}>
                    <MemberPortrait member={member} index={index} />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-7 sm:pb-8">
                <h3 className="text-2xl font-medium tracking-[-0.04em] text-[#ebe6dc]">Chairs &amp; Project Managers</h3>
                <span className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#81796b]"><Users className="h-3.5 w-3.5" aria-hidden="true" />{chairsAndPMs.length} members / 2026</span>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-5 xl:gap-x-7">
                {chairsAndPMs.map((member, index) => (
                  <MemberPortrait key={member.name} member={member} index={index} prefix="T" />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12 lg:col-span-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
                <SignalLabel>05 / Get involved</SignalLabel>
                <h2 className="mt-4 max-w-4xl text-[clamp(3rem,5.4vw,5.8rem)] font-medium leading-[0.86] tracking-[-0.065em]">
                  Come build something that has to work
                </h2>
                <p className="mt-7 max-w-2xl text-base leading-7 text-[#8d887f]">
                  Project teams typically recruit at the start of each semester. Workshops and events are announced through Discord and the club mailing list.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="https://discord.gg/MkPv9s9cj3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-11 items-center gap-3 bg-[#daa000] px-5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#11110f] transition-colors hover:bg-[#f0bd31]"
                  >
                    Join Discord
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/projects"
                    className="group inline-flex h-11 items-center gap-3 border border-white/[0.12] px-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#c7c0b5] transition-colors hover:border-[#daa000]/45 hover:text-[#f2c34f]"
                  >
                    Explore projects
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="flex flex-col justify-between px-5 py-10 sm:px-8 sm:py-12 lg:col-span-4 lg:px-10 lg:py-14">
                <div>
                  <p className="font-mono text-[0.57rem] uppercase tracking-[0.18em] text-[#5f5b55]">Contact channel</p>
                  <a
                    href="mailto:embedded@purdue.edu"
                    className="group mt-4 flex items-center justify-between border-y border-white/[0.08] py-4 text-lg tracking-[-0.03em] text-[#c9c3b8] transition-colors hover:text-[#f2c34f]"
                  >
                    embedded@purdue.edu
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>

                <Link
                  href="https://www.linkedin.com/company/embedded-purdue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-10 flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[#77726a] transition-colors hover:text-[#f2c34f]"
                >
                  Follow on LinkedIn
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

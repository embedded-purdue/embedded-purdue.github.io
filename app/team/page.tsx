import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Linkedin, Mail, Shield, Users } from "lucide-react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"

import armanImg from "../../public/team/arman.jpg"
import asthaImg from "../../public/team/astha.jpg"
import patrickImg from "../../public/team/patrick.jpg"
import gautamImg from "../../public/team/gautam.jpg"
import mahdiImg from "../../public/team/mahdi.jpg"

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

const pendingRoles = [
  {
    code: "02",
    title: "Chairs",
    status: "Appointments pending",
    detail: "Chair assignments will publish when the next operating cycle is finalized.",
  },
  {
    code: "03",
    title: "Project Managers",
    status: "Roster incoming",
    detail: "Project-manager assignments will publish alongside the next project cycle.",
  },
] as const

const WIDE_RAIL = "site-rail mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

function MemberPortrait({ member, index }: { member: Member; index: number }) {
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
          <span className="font-mono text-[0.56rem] tracking-[0.14em] text-[#716b62]">E-{String(index + 1).padStart(2, "0")}</span>
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

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main data-site-main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} relative px-5 py-10 sm:px-8 sm:py-12 lg:border-x lg:border-white/[0.06] lg:px-12 lg:py-14 xl:px-16`}>
            <div className="flex items-center justify-between gap-5 font-mono text-[0.6rem] uppercase tracking-[0.16em]">
              <span className="text-[#aaa398]">Team / 2026</span>
              <span className="text-[#81796b]">Student-led. Built together.</span>
            </div>
            <div className="mt-8 grid items-end gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
              <h1 className="max-w-4xl text-[clamp(3rem,5.5vw,6rem)] font-medium leading-[0.94] tracking-[-0.06em]">
                The people<br /><span className="text-[#d8aa27]">behind the systems.</span>
              </h1>
              <p className="max-w-lg text-base leading-7 text-[#969085]">
                Students keeping ES@P organized, technically ambitious, and moving from ideas to working hardware.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="executive-board" className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} px-5 pb-10 sm:px-8 sm:pb-12 lg:border-x lg:border-white/[0.06] lg:px-12 xl:px-16`}>
            <div className="flex flex-wrap items-center justify-between gap-4 py-7 sm:py-8">
              <h2 id="executive-board" className="text-2xl font-medium tracking-[-0.04em] text-[#ebe6dc]">Executive Board</h2>
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
        </section>

        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12 lg:col-span-4 lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
                <div className="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#777169]">
                  <Users className="h-4 w-4 text-[#8f7325]" aria-hidden="true" />
                  Structure in progress
                </div>
                <h2 className="mt-3 text-2xl font-medium tracking-[-0.045em] text-[#d8d2c7]">Next appointments</h2>
              </div>

              <div className="lg:col-span-8">
                {pendingRoles.map((role, index) => (
                  <div
                    key={role.title}
                    className={`grid min-h-[132px] gap-4 px-5 py-8 sm:grid-cols-[64px_180px_1fr] sm:items-center sm:px-8 lg:min-h-[146px] lg:px-10 lg:py-9 ${
                      index === 0 ? "border-b border-white/[0.08]" : ""
                    }`}
                  >
                    <span className="font-mono text-[0.54rem] uppercase tracking-[0.16em] text-[#5f5b55]">{role.code}</span>
                    <div>
                      <p className="text-lg font-medium tracking-[-0.035em] text-[#d9d3c8]">{role.title}</p>
                      <p className="mt-1 font-mono text-[0.5rem] uppercase tracking-[0.13em] text-[#8d7328]">{role.status}</p>
                    </div>
                    <p className="max-w-xl text-sm leading-6 text-[#777169]">{role.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-14 xl:px-16">
              <div>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#6b665f]">Build with us</p>
                <h2 className="mt-3 max-w-3xl text-[clamp(2.6rem,4.5vw,4.8rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                  The next name on this page could be yours.
                </h2>
              </div>
              <Link
                href="https://discord.gg/MkPv9s9cj3"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-11 w-fit items-center gap-3 bg-[#daa000] px-5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#11110f] transition-colors hover:bg-[#f0bd31]"
              >
                Join ES@P
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

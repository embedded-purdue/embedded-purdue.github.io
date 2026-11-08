import Link from "next/link"
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Shield,
} from "lucide-react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"
import { TeamPortrait } from "@/components/site/team-portrait"
import { readTeamContent } from "@/lib/cms/content"
import type { TeamMemberContent } from "@/lib/cms/schema"

const WIDE_RAIL = "site-rail mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

type Member = TeamMemberContent

function SignalLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#c4bfb7]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
      <span>{children}</span>
    </div>
  )
}

function MemberPortrait({ member, index, prefix = "E" }: { member: Member; index: number; prefix?: string }) {
  const socialLinkClass =
    "grid h-10 w-10 shrink-0 place-items-center border border-white/[0.12] text-[#c4bfb7] transition-colors hover:border-[#daa000]/50 hover:text-[#f2c34f]"

  return (
    <article className="min-w-0">
      <TeamPortrait photo={member.image} name={member.name} />
      <div className="border-t border-white/[0.1] pt-5">
        {member.roles.map((role) => (
          <p key={role} className="font-mono text-[0.62rem] uppercase leading-5 tracking-[0.12em] text-[#c39b36]">{role}</p>
        ))}
        <h3 className="mt-2 text-[clamp(1.15rem,1.7vw,1.65rem)] font-medium leading-tight tracking-[-0.035em] text-[#eee8de]">{member.name}</h3>
        <div className="mt-4 flex min-h-10 items-center justify-between gap-2">
          <span className="font-mono text-[0.56rem] tracking-[0.14em] text-[#9c9791]">{prefix}-{String(index + 1).padStart(2, "0")}</span>
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

export default async function TeamPage() {
  const team = (await readTeamContent()).filter((member) => member.active)
  const executives = team.filter((member) => member.section === "exec")
  const chairsAndPMs = team.filter((member) => member.section !== "exec")

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main data-site-main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="flex min-h-[380px] flex-col justify-between border-b border-white/[0.08] px-5 py-9 sm:px-8 sm:py-10 lg:col-span-8 lg:min-h-[440px] lg:border-b-0 lg:border-r lg:px-12 lg:py-11 xl:px-16">
                <div className="flex items-center justify-between gap-4">
                  <SignalLabel>Team</SignalLabel>
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#888682]">
                    West Lafayette · Indiana
                  </span>
                </div>

                <div className="max-w-3xl py-9 lg:py-10">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.19em] text-[#9a9791]">Who runs ES@P</p>
                  <h1 className="mt-4 text-[clamp(2.9rem,5.6vw,5.8rem)] font-medium leading-[0.88] tracking-[-0.065em] text-[#f3efe6]">
                    The people
                    <span className="block text-[#d8aa27]">behind the systems</span>
                  </h1>
                  <p className="mt-6 max-w-xl text-[clamp(1rem,1.2vw,1.15rem)] leading-8 text-[#b7b3ac]">
                    Students keeping ES@P organized, technically ambitious, and actually shipping hardware.
                  </p>
                </div>

                <Link
                  href="/about"
                  className="group inline-flex h-11 w-fit items-center gap-3 border border-white/[0.12] px-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#d8d3cb] transition-colors hover:border-[#daa000]/45 hover:text-[#f2c34f]"
                >
                  Back to about
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:col-span-4">
                <div className="flex flex-col justify-center border-b border-white/[0.08] px-5 py-8 sm:px-8 lg:border-r lg:border-b-0">
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.17em] text-[#9a9791]">Executives</p>
                  <p className="mt-2 flex items-center gap-2 text-3xl font-medium tracking-[-0.04em] text-[#f0ece2]">
                    <Shield className="h-5 w-5 text-[#d8aa27]" aria-hidden="true" />
                    {executives.length}
                  </p>
                </div>
                <div className="flex flex-col justify-center border-b border-white/[0.08] px-5 py-8 sm:px-8 lg:border-b-0">
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.17em] text-[#9a9791]">Chairs &amp; PMs</p>
                  <p className="mt-2 text-3xl font-medium tracking-[-0.04em] text-[#f0ece2]">{chairsAndPMs.length}</p>
                </div>
                <div className="col-span-2 flex flex-col justify-center border-t border-white/[0.08] px-5 py-8 sm:px-8">
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.17em] text-[#9a9791]">Roster / 2026</p>
                  <p className="mt-2 text-lg leading-6 text-[#d6d2ca]">
                    {team.length} students keeping ES@P organized across committees, projects, and events.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="px-5 pb-10 pt-10 sm:px-8 sm:pb-12 sm:pt-12 lg:px-12 lg:pt-14 xl:px-16">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-7 sm:pb-8">
                <h2 className="text-2xl font-medium tracking-[-0.04em] text-[#ebe6dc]">Executive Board</h2>
                <span className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#a7a197]"><Shield className="h-3.5 w-3.5" aria-hidden="true" />{executives.length} executives / 2026</span>
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
                <h2 className="text-2xl font-medium tracking-[-0.04em] text-[#ebe6dc]">Committees &amp; Project Managers</h2>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-5 xl:gap-x-7">
                {chairsAndPMs.map((member, index) => (
                  <MemberPortrait key={member.name} member={member} index={index} prefix="T" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

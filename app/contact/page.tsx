import Link from "next/link"
import { ArrowUpRight, Handshake } from "lucide-react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"

import { ContactForm } from "./_ContactForm"

const WIDE_RAIL = "site-rail mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main data-site-main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} relative px-5 py-10 sm:px-8 sm:py-12 lg:border-x lg:border-white/[0.06] lg:px-12 lg:py-14 xl:px-16`}>
            <div className="flex items-center justify-between gap-5 font-mono text-[0.6rem] uppercase tracking-[0.16em]">
              <span className="text-[#c4bfb7]">Contact / Partnerships</span>
              <span className="hidden text-[#a7a197] sm:block">Sponsors ↔ ES@P</span>
            </div>
            <div className="mt-8 grid items-end gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
              <h1 className="max-w-4xl text-[clamp(3rem,5.5vw,6rem)] font-medium leading-[0.94] tracking-[-0.06em]">
                Let&apos;s build a<br /><span className="text-[#d8aa27]">partnership</span>
              </h1>
              <p className="max-w-lg text-base leading-7 text-[#b6b1aa]">
                Sponsors, recruiters, and technical partners: reach out and the ES@P team will find the highest-value way
                to work together.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
              {/* Intro */}
              <div className="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#a09c96]">
                <Handshake className="h-4 w-4 text-[#8f7325]" aria-hidden="true" />
                Partner with ES@P
              </div>
              <h2 className="mt-4 text-[clamp(2.2rem,3.6vw,3.4rem)] font-medium leading-[0.95] tracking-[-0.05em]">
                Tell us what your team cares about
              </h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-[#a7a39e]">
                Whether it&apos;s recruiting, technical education, project collaboration, or hardware support, share a
                few details and we&apos;ll follow up quickly. Prefer tiers and benefits first?{" "}
                <Link href="/sponsors" className="text-[#f2c34f] transition-colors hover:text-[#daa000]">
                  See sponsorship levels
                </Link>
                .
              </p>

              {/* Form */}
              <div className="mt-10 border-t border-white/[0.08] pt-10">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#a09c96]">Send a message</p>
                  <ArrowUpRight className="h-4 w-4 text-[#766021]" aria-hidden="true" />
                </div>
                <div className="mt-7">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

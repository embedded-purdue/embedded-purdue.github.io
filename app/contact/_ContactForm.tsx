"use client"

import { useState } from "react"
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react"

// Web3Forms delivers submissions to the inbox that registered the access key.
// Register embedded@purdue.edu at https://web3forms.com to get a key, then set
// NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in the build environment (GitHub repo variable).
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? ""

type Status = "idle" | "submitting" | "success" | "error"

const inputClass =
  "h-12 w-full border border-white/[0.12] bg-black/40 px-4 text-sm text-[#f0ece2] outline-none transition-colors placeholder:text-[#6f6a62] focus:border-[#daa000]/55 focus:bg-black/60"

const labelClass = "font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#89857d]"

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string>("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setError("")

    const form = event.currentTarget
    const formData = new FormData(form)
    formData.append("access_key", ACCESS_KEY)
    formData.append("from_name", "ES@P Website Contact Form")

    if (!ACCESS_KEY) {
      setStatus("error")
      setError("The contact form isn't configured yet. Please email embedded@purdue.edu directly.")
      return
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      })
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        form.reset()
      } else {
        setStatus("error")
        setError(data.message || "Something went wrong. Please try again or email us directly.")
      }
    } catch {
      setStatus("error")
      setError("Couldn't reach the mail service. Please email embedded@purdue.edu directly.")
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center gap-4">
        <CheckCircle2 className="h-8 w-8 text-[#daa000]" aria-hidden="true" />
        <h3 className="text-2xl font-medium tracking-[-0.04em] text-[#ebe6dc]">Message sent</h3>
        <p className="max-w-md text-sm leading-6 text-[#817c74]">
          Thanks for reaching out. The ES@P team will get back to you at the email you provided. For anything urgent,
          you can also reach us directly at{" "}
          <a href="mailto:embedded@purdue.edu" className="text-[#f2c34f] transition-colors hover:text-[#daa000]">
            embedded@purdue.edu
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 inline-flex h-10 items-center gap-2 border border-white/[0.12] px-4 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#c7c0b5] transition-colors hover:border-[#daa000]/45 hover:text-[#f2c34f]"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Honeypot field for spam bots — hidden from real users. */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="organization" className={labelClass}>Organization</label>
          <input id="organization" name="organization" type="text" required autoComplete="organization" placeholder="Company / organization" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>Work email</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className={labelClass}>Type of partnership</label>
        <div className="relative">
          <select
            id="subject"
            name="subject"
            required
            defaultValue=""
            className={`${inputClass} appearance-none pr-10`}
          >
            <option value="" disabled>Select an area of interest</option>
            <option value="Sponsorship inquiry">Sponsorship / financial support</option>
            <option value="Hardware or equipment donation">Hardware / equipment donation</option>
            <option value="Recruiting & hiring">Recruiting &amp; hiring</option>
            <option value="Workshop or speaker collaboration">Workshop / speaker collaboration</option>
            <option value="General partnership inquiry">General partnership inquiry</option>
          </select>
          <ArrowUpRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#6f6a62]" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us about your organization and how you'd like to work with ES@P."
          className={`${inputClass} h-auto resize-y py-3 leading-6`}
        />
      </div>

      {status === "error" && (
        <p className="border border-red-500/30 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex h-12 w-full items-center justify-center gap-3 bg-[#daa000] px-5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#11110f] transition-colors hover:bg-[#f0bd31] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
      >
        {status === "submitting" ? (
          <>
            Sending
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          </>
        ) : (
          <>
            Send message
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </>
        )}
      </button>

      <p className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-[#5f5b55]">
        Goes straight to embedded@purdue.edu
      </p>
    </form>
  )
}

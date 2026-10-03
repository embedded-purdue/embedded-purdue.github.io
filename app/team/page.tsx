"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// The team roster now lives on the About page. Keep /team working by
// redirecting anyone who lands here (old links, bookmarks) to /about#team.
export default function TeamRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/about#team")
  }, [router])

  return (
    <div className="grid min-h-screen place-items-center bg-[#0c0c0b] px-6 text-center text-[#f3efe6]">
      <div>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#aaa398]">Redirecting</p>
        <p className="mt-3 text-lg text-[#c4beb4]">
          The team now lives on the{" "}
          <Link href="/about#team" className="text-[#f2c34f] underline underline-offset-4">
            About page
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

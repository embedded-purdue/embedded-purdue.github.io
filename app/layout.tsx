import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Embedded Systems at Purdue | About Us",
  description:
    "Join Purdue's premier embedded systems club. Learn microcontroller programming, FPGA design, and build innovative hardware projects with fellow students.",
  generator: "esap-web",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Add "dark" so the .dark token set becomes the default site-wide
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
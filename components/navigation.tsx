"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Users, FolderOpen, Mail, UserSquare2 } from "lucide-react"
import { DiscordIcon } from "@/components/icons/discord-icon"
import Image from "next/image"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Users },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Workshops", href: "/workshops", icon: Mail },
  { name: "Team", href: "/team", icon: UserSquare2 },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* allow height to grow instead of hard-capping at h-16 */}
        <div className="flex justify-between items-center min-h-16 py-2">
          {/* Logo + brand */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Embedded Systems @ Purdue logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
            {/* Short label on xs, full on md+; prevent wrap on small to avoid overlap */}
            <span className="font-bold text-lg text-foreground md:hidden">
              ES@P
            </span>
            <span className="hidden md:inline font-bold text-lg text-foreground whitespace-nowrap">
              Embedded Systems at Purdue
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
            <Button
              variant="ghost"
              size="lg" // larger touch target
              asChild
              className="flex items-center justify-start space-x-3 py-3 px-4 text-lg"
            >
              <Link
                href="https://discord.gg/MkPv9s9cj3"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join our Discord"
                className="flex items-center"
              >
                {/* Modern Discord SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 127.14 96.36"
                  className="w-6 h-6 mr-3 fill-current text-indigo-500"
                >
                  <path d="M107.7 8.07A105.15 105.15 0 0 0 81.54 0a72.06 72.06 0 0 0-3.36 6.91 97.68 97.68 0 0 0-29.22 0A72.06 72.06 0 0 0 45.6 0 105.15 105.15 0 0 0 19.44 8.09C2.82 32.65-1.7 56.6.54 80.21a105.73 105.73 0 0 0 31.82 16.15 77.7 77.7 0 0 0 6.85-11.1 68.42 68.42 0 0 1-10.8-5.15c.9-.65 1.77-1.33 2.62-2a69.86 69.86 0 0 0 60.5 0c.85.7 1.72 1.38 2.62 2a68.68 68.68 0 0 1-10.8 5.15 77.7 77.7 0 0 0 6.85 11.1 105.73 105.73 0 0 0 31.82-16.15c2.45-25.46-4.19-49.33-21.3-72.14ZM42.7 65.44c-5.16 0-9.4-4.82-9.4-10.74s4.15-10.74 9.4-10.74S52.1 49 52.1 54.7c0 5.92-4.15 10.74-9.4 10.74Zm41.74 0c-5.16 0-9.4-4.82-9.4-10.74s4.15-10.74 9.4-10.74S93.84 49 93.84 54.7c0 5.92-4.15 10.74-9.4 10.74Z" />
                </svg>
                <span className="font-medium">Join our Discord</span>
              </Link>
            </Button>
          </div>

          {/* Mobile nav */}
          <div className="flex items-center md:hidden">
            <Button asChild variant="ghost" size="icon" aria-label="Join our Discord">
              <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="h-5 w-5" />
              </Link>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const active = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                          active ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    )
                  })}
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href="https://discord.gg/MkPv9s9cj3"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Join our Discord"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                      >
                        <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3c-.2.36-.43.85-.589 1.231a18.27 18.27 0 0 0-4-.002c-.16-.381-.39-.872-.59-1.232A19.79 19.79 0 0 0 6.04 4.37C3.852 7.63 3.288 10.79 3.515 13.9a19.9 19.9 0 0 0 6.02 3.073c.468-.647.885-1.334 1.243-2.053a12.86 12.86 0 0 1-1.95-.75c.164-.12.325-.246.48-.376 3.773 1.76 7.86 1.76 11.6 0 .158.13.319.256.48.377-.623.3-1.28.55-1.955.75.36.72.777 1.405 1.246 2.053a19.9 19.9 0 0 0 6.016-3.073c.25-3.392-.565-6.528-2.398-9.532ZM9.77 12.86c-.9 0-1.63-.82-1.63-1.83 0-1.01.72-1.83 1.63-1.83s1.64.82 1.63 1.83c0 1.01-.72 1.83-1.63 1.83Zm4.46 0c-.9 0-1.63-.82-1.63-1.83 0-1.01.73-1.83 1.63-1.83s1.64.82 1.63 1.83c0 1.01-.72 1.83-1.63 1.83Z" />
                      </svg>
                      Discord
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

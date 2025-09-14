"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Users, FolderOpen, Briefcase, Mail } from "lucide-react"
const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Users },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Workshops", href: "/workshops", icon: Mail },
  { name: "Team", href: "/team", icon: Mail },
  { name: "Resources", href: "/resources", icon: Mail },

]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ESP</span>
            </div>
            <span className="font-bold text-lg text-foreground">Embedded Systems at Purdue</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            <Button size="sm" className="ml-4">
            <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                    Join Our Discord
                  </Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 rounded-lg hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
                <Button className="mt-4 w-full">                  <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                    Join Our Discord
                  </Link></Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

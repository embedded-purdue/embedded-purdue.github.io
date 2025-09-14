import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Cpu, Users, Zap, Mail, Github, Linkedin, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                <Cpu className="w-4 h-4 mr-2" />
                Student Organization
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Embedded Systems at <span className="text-primary">Purdue</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Apply embedded systems concepts through technical projects using microcontrollers, FPGAs, and modern
                development tools. Connect with peers passionate about hardware and embedded software.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                    Join Our Discord
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
                  <Link href="/projects">
                    View Projects
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/logo.svg"
                  alt="Embedded Systems Club members working on projects"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">100+ Active Members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    {/* Calendar (embedded GCal) */}
<section className="py-20 px-4">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-2xl font-semibold mb-4">Events & Workshops</h2>
    <div className="rounded-xl overflow-hidden border bg-background">
      <iframe
        src="https://calendar.google.com/calendar/embed?src=YOUR_EMBED_URL&mode=AGENDA"
        style={{ border: 0 }}
        width="100%"
        height="600"
        frameBorder="0"
        scrolling="no"
      />
    </div>

    {/* Subscribe buttons */}
    <div className="mt-4 flex gap-3">
      <a
        href="https://calendar.google.com/calendar/u/0?cid=YOUR_CALENDAR_ID%40group.calendar.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        + Add to Google Calendar
      </a>
      <a
        href="https://calendar.google.com/calendar/ical/YOUR_CALENDAR_ID%40group.calendar.google.com/public/basic.ics"
        className="underline"
      >
        Subscribe via iCal (.ics)
      </a>
    </div>
  </div>
</section>
      {/* Quick Links */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-center">About Us</CardTitle>
                <CardDescription className="text-center">
                  Learn about our mission, activities, and how to get involved in the embedded systems community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/about">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader>
                <Cpu className="w-12 h-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-center">Projects</CardTitle>
                <CardDescription className="text-center">
                  Explore innovative embedded systems projects created by our members, from IoT to FPGA implementations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/projects">
                    View Projects
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader>
                <Zap className="w-12 h-12 text-secondary mx-auto mb-4" />
                <CardTitle className="text-center">Sponsors</CardTitle>
                <CardDescription className="text-center">
                  Meet our industry partners who support embedded systems education and student development.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/sponsors">
                    View Sponsors
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ESP</span>
            </div>
            <span className="text-2xl font-bold">Embedded Systems at Purdue</span>
          </div>
          <p className="text-muted-foreground">Building the future of embedded technology, one project at a time.</p>
          <div className="flex justify-center gap-6">
            <Button variant="ghost" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Button>
            <Button variant="ghost" size="sm">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button variant="ghost" size="sm">
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Last updated: Sep 7, 2025</p>
        </div>
      </footer>
    </div>
  )
}

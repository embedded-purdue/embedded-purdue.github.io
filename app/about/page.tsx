import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Cpu, Users, Zap, Mail, ExternalLink, Hammer, Cpu as CpuIcon, Trophy, Mic, Network } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                <Cpu className="w-4 h-4 mr-2" />
                Student Organization
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                About <span className="text-primary">Embedded Systems at Purdue</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                We are a student organization dedicated to fostering learning and collaboration in embedded systems.
                Our mission is to provide hands-on experience with microcontrollers, FPGAs, and modern development tools
                while building a community of passionate engineers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                    Join Our Discord
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
                  <Link href="/projects">View Projects</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/founders.jpeg"
                  alt="Embedded Systems @ Purdue group photo"
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

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Hands-On Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Apply embedded systems concepts through technical projects.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                <CardTitle>Community Building</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with others passionate about hardware and embedded software.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Cpu className="w-12 h-12 text-secondary mx-auto mb-4" />
                <CardTitle>Professional Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access industry insights, alumni connections, and research opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-6xl mx-auto space-y-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-center">Activities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CpuIcon className="w-10 h-10 mx-auto mb-2" />
                <CardTitle className="text-center">Technical Workshops</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-center">
                Microcontrollers, RTOS, debugging, and PCB design.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Hammer className="w-10 h-10 mx-auto mb-2" />
                <CardTitle className="text-center">Project Teams</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-center">
                Build real-world systems — robotics to IoT.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Mic className="w-10 h-10 mx-auto mb-2" />
                <CardTitle className="text-center">Speaker Events</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-center">
                Industry leaders from Amazon Robotics, Milwaukee Tool, Garmin, and more.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="w-10 h-10 mx-auto mb-2" />
                <CardTitle className="text-center">Competitions & Hackathons</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-center">
                National events and internal challenges.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Network className="w-10 h-10 mx-auto mb-2" />
                <CardTitle className="text-center">Mentorship</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-center">
                Career guidance and technical advice from experienced mentors.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold">Why Join?</h2>
          <ul className="grid sm:grid-cols-2 gap-4 text-left">
            <li className="p-4 rounded-lg border bg-card">
              Build a <span className="font-semibold">portfolio</span> of embedded projects.
            </li>
            <li className="p-4 rounded-lg border bg-card">
              Gain technical skills highly valued by employers.
            </li>
            <li className="p-4 rounded-lg border bg-card">
              Connect with like-minded students.
            </li>
            <li className="p-4 rounded-lg border bg-card">
              Access internal job opportunities and alumni networks.
            </li>
          </ul>
        </div>
      </section>

      {/* Get Involved / Contact */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold">How to Get Involved</h2>
          <div className="space-y-2 text-muted-foreground">
            <p><span className="font-medium">Project Teams:</span> Apply at the start of each semester.</p>
            <p>
              <span className="font-medium">Workshops & Events:</span> Posted on{" "}
              <Link href="https://discord.gg/MkPv9s9cj3" className="text-primary underline" target="_blank" rel="noopener noreferrer">
                Discord
              </Link>{" "}
              and Mailing List.
            </p>
          </div>

          <blockquote className="max-w-2xl mx-auto italic text-muted-foreground">
            Whether you're experienced or just starting, <span className="not-italic font-medium">Embedded Systems @ Purdue</span> is your community for building, learning, and innovating.
          </blockquote>

          <div className="space-y-4 mt-10">
            <p className="text-lg text-muted-foreground">
              Questions? Contact us at{" "}
              <a href="mailto:embedded@purdue.edu" className="text-primary hover:underline font-medium">
                embedded@purdue.edu
              </a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                <Mail className="w-5 h-5 mr-2" />
                Join Our Discord
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
              <Link
                href="https://www.linkedin.com/company/embedded-purdue"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Follow on LinkedIn
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />

    </div>
  )
}

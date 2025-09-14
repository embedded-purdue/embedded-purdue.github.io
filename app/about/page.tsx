import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Cpu, Users, Zap, Mail, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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
                About <span className="text-primary">Embedded Systems at Purdue</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                We are a student organization dedicated to fostering learning and collaboration in embedded systems. Our
                mission is to provide hands-on experience with microcontrollers, FPGAs, and modern development tools
                while building a community of passionate engineers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8">
                  <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                    Join Our Discord
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  View Projects
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/embedded-systems-students-working-on-microcontroll.jpg"
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

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Hands-On Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Apply embedded systems concepts through technical projects using microcontrollers, FPGAs, and modern
                  development tools.
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
                  Connect with peers passionate about hardware and embedded software, fostering collaboration and
                  knowledge sharing.
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
                  Access industry insights, career guidance, and technical advice from experienced mentors and industry
                  professionals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Get Involved</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Whether you're experienced or just starting, there's a place for you in our embedded systems community.
          </p>

          <div className="space-y-4 mt-12">
            <p className="text-lg text-muted-foreground">
              Interested? Contact us at{" "}
              <a href="mailto:embedded@purdue.edu" className="text-primary hover:underline font-medium">
                embedded@purdue.edu
              </a>
            </p>
            <p className="text-muted-foreground">We'd love to hear from you!</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="text-lg px-8">
              <Mail className="w-5 h-5 mr-2" />
              <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                    Join Our Discord
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <ExternalLink className="w-5 h-5 mr-2" />
              Follow on LinkedIn
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

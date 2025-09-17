import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Building2, Heart, Handshake, Mail, ExternalLink } from "lucide-react"
import { Footer } from "@/components/footer"

const sponsors = [

]

const sponsorshipTiers = [
  {
    name: "Platinum",
    amount: "$5,000+",
    color: "bg-gradient-to-r from-gray-300 to-gray-100",
    benefits: [
      "Logo on all club materials and website",
      "Dedicated recruiting events",
      "Access to student resumes",
      "Speaking opportunities at meetings",
      "Priority project collaboration",
    ],
  },
  {
    name: "Gold",
    amount: "$2,500+",
    color: "bg-gradient-to-r from-yellow-400 to-yellow-200",
    benefits: [
      "Logo on website and select materials",
      "Recruiting table at events",
      "Access to student resumes",
      "Speaking opportunities",
      "Project collaboration opportunities",
    ],
  },
  {
    name: "Silver",
    amount: "$1,000+",
    color: "bg-gradient-to-r from-gray-400 to-gray-200",
    benefits: [
      "Logo on website",
      "Recruiting presence at events",
      "Access to student contact info",
      "Newsletter mentions",
    ],
  },
  {
    name: "Bronze",
    amount: "$500+",
    color: "bg-gradient-to-r from-amber-600 to-amber-400",
    benefits: ["Logo on website", "Newsletter mentions", "Event announcements"],
  },
]

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="w-fit mx-auto mb-6">
            <Building2 className="w-4 h-4 mr-2" />
            Industry Partners
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight mb-6">
            Our <span className="text-primary">Sponsors</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
            We're grateful for the support of industry leaders who help make our projects and events possible. Their
            partnership enables us to provide cutting-edge learning experiences for our members.
          </p>
        </div>
      </section>

      {/* Current Sponsors */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">Current Sponsors</h2>
            <p className="text-xl text-muted-foreground">
              Thank you to our amazing sponsors who support embedded systems education at Purdue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sponsors.map((sponsor, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-full h-20 flex items-center justify-center mb-4 bg-muted/30 rounded-lg">
                    <img
                      src={sponsor.logo || "/placeholder.svg"}
                      alt={`${sponsor.name} logo`}
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{sponsor.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        sponsor.tier === "Platinum"
                          ? "border-gray-400 text-gray-700"
                          : sponsor.tier === "Gold"
                            ? "border-yellow-400 text-yellow-700"
                            : sponsor.tier === "Silver"
                              ? "border-gray-300 text-gray-600"
                              : "border-amber-400 text-amber-700"
                      }
                    >
                      {sponsor.tier}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{sponsor.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">Sponsorship Opportunities</h2>
            <p className="text-xl text-muted-foreground">
              Partner with us to support the next generation of embedded systems engineers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipTiers.map((tier, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className={`h-2 ${tier.color}`} />
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-primary">{tier.amount}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="text-sm text-muted-foreground flex items-start">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Handshake className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Become a Sponsor</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join our mission to advance embedded systems education and connect with talented engineering students at
            Purdue University.
          </p>

          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Interested in sponsoring? Contact us at{" "}
              <a href="embedded@purdue.edu" className="text-primary hover:underline font-medium">
                embedded@purdue.edu
              </a>
            </p>
            <p className="text-muted-foreground">We'd love to discuss partnership opportunities with you!</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="text-lg px-8">
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Heart className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>
      <Footer />

    </div>
  )
}
// app/sponsors/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Building2, Heart, Handshake, Mail, ExternalLink } from "lucide-react";
import { Footer } from "@/components/footer";

type Sponsor = {
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
};

const sponsors: Sponsor[] = []; // no sponsors right now

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
];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="w-fit mx-auto mb-6">
            <Building2 className="w-4 h-4 mr-2" />
            Sponsors
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight mb-6">
            Embedded Systems @ Purdue — <span className="text-primary">Sponsor Us</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
            We’re Embedded Systems @ Purdue (ES@P) — a student-led organization building a strong
            community of innovators passionate about embedded systems, hardware, and software.
            We believe in hands-on learning, real-world projects, and connecting students with industry.
          </p>
        </div>
      </section>

      {/* Why Sponsor Us + Our Reach */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Why Sponsor Us?</CardTitle>
              <CardDescription>Real impact, real talent, real projects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <ul className="space-y-2">
                <li>• <b>Top Talent Access:</b> Meet motivated engineers — future firmware, embedded software, and hardware designers.</li>
                <li>• <b>Brand Visibility:</b> Your logo on projects, workshops, hackathons, and marketing materials.</li>
                <li>• <b>Impactful Mentorship:</b> Host tech talks, mentor projects, or hang out with us at events.</li>
                <li>• <b>Recruitment Pipeline:</b> Connect early with students building real embedded systems.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Reach (and Growing!)</CardTitle>
              <CardDescription>Engaged, hands-on community</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-muted-foreground">
              <div className="flex items-center gap-2">🎯 <span><b>50+ active members</b></span></div>
              <div className="flex items-center gap-2">⚙️ <span><b>10+ ongoing hardware/software projects</b></span></div>
              <div className="flex items-center gap-2">🎤 <span><b>Frequent workshops and speaker series</b></span></div>
              <div className="flex items-center gap-2">📬 <span><b>Mailing list, LinkedIn, campus promotions</b></span></div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How You Can Support + What You’ll Get */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>How You Can Support</CardTitle>
              <CardDescription>Multiple ways to partner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <ul className="space-y-2">
                <li>• <b>Monetary Sponsorship:</b> Fund components, dev boards, travel, and workshop supplies.</li>
                <li>• <b>Equipment Donations:</b> MCUs, FPGAs, tools, dev kits — if we can blink an LED with it, we’ll love it.</li>
                <li>• <b>Event Sponsorship:</b> Co-host a workshop, mini-hackathon, or tech talk night.</li>
                <li>• <b>Recruitment Opportunities:</b> Share internships, co-ops, or roles with our members.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What You’ll Get</CardTitle>
              <CardDescription>Visibility & access to talent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <ul className="space-y-2">
                <li>• Featured logo and link on our website, flyers, and banners</li>
                <li>• Shout-outs at events and on social media</li>
                <li>• Optional resume books and early access to top students</li>
                <li>• A direct channel to Purdue’s most passionate builders</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Current Sponsors */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">Current Sponsors</h2>
            <p className="text-lg text-muted-foreground">
              We’re actively seeking inaugural partners. Your company could be featured here!
            </p>
          </div>

          {sponsors.length === 0 ? (
            <Card className="max-w-3xl mx-auto border-dashed">
              <CardHeader className="text-center">
                <CardTitle>No sponsors yet — be the first!</CardTitle>
                <CardDescription>
                  Get prime visibility on our site and at events. Lead the way in supporting hands-on embedded education.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" asChild>
                  <a href="mailto:embedded@purdue.edu?subject=ES@P%20Sponsorship%20Inquiry">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Us
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent" asChild>
                  <a href="#tiers">
                    <Heart className="w-5 h-5 mr-2" />
                    View Tiers
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
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
                    {sponsor.website ? (
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Website
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full bg-transparent" disabled>
                        Website Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section id="tiers" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
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
                  <CardDescription className="text-lg font-semibold text-primary">
                    {tier.amount}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start">
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
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Let’s Build Something Together</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Interested? Curious? Got questions? We’d love to hear from you.
            Reach out and we’ll set up a quick call about partnerships.
          </p>

          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              Email us at{" "}
              <a
                href="mailto:embedded@purdue.edu"
                className="text-primary hover:underline font-medium"
              >
                embedded@purdue.edu
              </a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button size="lg" className="text-lg px-8" asChild>
              <a href="mailto:embedded@purdue.edu?subject=ES@P%20Sponsorship%20Inquiry">
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
              <a href="#tiers">
                <Heart className="w-5 h-5 mr-2" />
                Learn More
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
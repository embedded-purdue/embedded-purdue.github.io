import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Cpu, Zap, Wifi, Camera, Car, Home, Github, ExternalLink, Watch } from "lucide-react"

type Project = {
  title: string
  description: string
  technologies: string[]
  status: "Active" | "Planned" | "Completed"
  icon: any
  image: string
  pm?: string
  repoUrl?: string
  demoUrl?: string
}

const projects: Project[] = [
  {
    title: "Agrovolo (Aerial Farm Imaging)",
    description: "Drone that captures field images for farmers; focus on control, wireless links, and UI.",
    technologies: ["Control Systems", "Wireless", "PCB", "High-Speed", "UI"],
    status: "Active",
    icon: Camera,
    image: "/projects/agrovolo-drone.jpg",
    pm: "PM: Tim Ausec",
  },
  {
    title: "BerryWeather (IoT Weather Station)",
    description: "Sensor-equipped wireless weather station on Pi/MCU with power-conscious design.",
    technologies: ["Raspberry Pi OS", "Sensors", "Embedded C", "Schematic/PCB", "Power"],
    status: "Active",
    icon: Wifi,
    image: "/projects/weather-station.jpg",
    pm: "PM: Connor Powell",
  },
  {
    title: "HarmoniCore (FPGA DSP Autotune)",
    description: "FPGA-based DSP core that autotunes your voice in real time.",
    technologies: ["FPGA/HDL", "DSP (Python)", "PCB/Bringup", "Audio"],
    status: "Active",
    icon: Zap,
    image: "/projects/fpga-audio.jpg",
    pm: "PM: Varun",
  },
  {
    title: "slayterHiL (Hardware-in-the-Loop)",
    description: "Make the drone think it’s flying—break it in software before it breaks itself.",
    technologies: ["RTOS (C)", "C++ Systems", "Board Bringup", "Wi-Fi/BLE"],
    status: "Active",
    icon: Cpu,
    image: "/projects/hil-lab.jpg",
    pm: "PM: Alex Aylward",
  },
  {
    title: "BB-8 (Mobile Robot)",
    description: "“Circle guy” from Star Wars—vision + wireless + motor/PID control.",
    technologies: ["Computer Vision", "Wireless", "Motor Control", "PID"],
    status: "Planned",
    icon: Car,
    image: "/projects/bb8-robot.jpg",
    pm: "PM: Tom",
  },
  {
    title: "MicroPiano",
    description: "Mini piano using hall sensors and an STM32; analog front-end + KiCad.",
    technologies: ["STM32 (C)", "Peripherals", "Analog", "KiCad", "CAD"],
    status: "Planned",
    icon: Zap,
    image: "/projects/micropiano.jpg",
    pm: "PM: Felix Liu",
  },
  {
    title: "EyeCue (Hands-Free Pointer)",
    description: "Blink/eyebrow/gaze-driven cursor using CV on Pi; accessibility oriented.",
    technologies: ["Computer Vision", "Raspberry Pi OS", "Python/C", "Mech/CAD"],
    status: "Active",
    icon: Camera,
    image: "/projects/eyecue.jpg",
    pm: "PMs: Katherine M, Garima T, Aarushi D, Shruthi A",
  },
  {
    title: "Digital Operations",
    description: "Club website + workflow automation for media intake and requests.",
    technologies: ["TypeScript", "Astro/Next", "Tailwind", "APIs", "Automation"],
    status: "Active",
    icon: Cpu,
    image: "/projects/digital-ops.jpg",
    pm: "PM: Trevor Antle",
  },
  {
    title: "Smart Watch",
    description:
      "A smart watch for the people! Build your own wearable with ESP32, sensors, and custom firmware. Learn PCB design, microcontrollers, watch mechanics, app design, wireless communication, and more.",
    technologies: [
      "ESP32",
      "PCB Design",
      "Data Storage",
      "Sensors",
      "Wireless",
      "App Design",
      "Watch Mechanics",
    ],
    status: "Planned",
    icon: Watch, // from lucide-react
    image: "/projects/smartwatch.jpg", // drop the slide image into public/projects/
    pm: "PM: TBD",
  }
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="w-fit mx-auto mb-6">
            <Cpu className="w-4 h-4 mr-2" />
            Student Projects
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight mb-6">
            Our <span className="text-primary">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
            Hands-on teams building drones, DSP on FPGA, HIL rigs, robotics, accessibility tech, and the club’s digital platform.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const Icon = project.icon
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-6 h-6 text-primary" />
                      <Badge variant={project.status === "Active" ? "default" : project.status === "Completed" ? "secondary" : "outline"}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="text-base">{project.description}</CardDescription>
                    {project.pm && <p className="mt-2 text-sm text-muted-foreground">{project.pm}</p>}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                        <a href={project.repoUrl || "#"} target={project.repoUrl ? "_blank" : undefined} rel="noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <a href={project.demoUrl || "#"} target={project.demoUrl ? "_blank" : undefined} rel="noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Want to Build Something Amazing?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join our project teams and work on cutting-edge embedded systems that solve real-world problems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Join a Project Team
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              Propose a Project
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
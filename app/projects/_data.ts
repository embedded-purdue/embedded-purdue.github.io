// app/projects/_data.ts
import {
  Bot,
  Camera,
  CircuitBoard,
  Cpu,
  Crown,
  Dog,
  House,
  Leaf,
  Music,
  Orbit,
  Radar,
  Rocket,
  Sparkles,
  Watch,
  Wifi,
  Zap,
} from "lucide-react";

export type Project = {
  slug: string;
  title: string;
  description?: string;
  technologies: string[];
  status: "Active" | "Planned" | "Completed";
  icon?: any;
  image?: string;
  pm?: string;
  semester?: string;
  /** Where “Read more” should go (README.md or long-form doc) */
  readmeUrl?: string; // can be external OR /projects/[slug]
};

export const projects: Project[] = [
  // ───────────────────────── Active · Fall 2026 ─────────────────────────
  {
    slug: "paws",
    title: "PAWS (Quadruped Robot Dog)",
    description:
      "An 8-DOF quadruped robot dog that walks using a reinforcement-learning locomotion policy and onboard computer vision, all running on an ESP32-P4.",
    technologies: ["ESP32", "Machine Learning", "Computer Vision", "MuJoCo", "Embedded C/C++", "ESP-IDF", "CAD"],
    status: "Active",
    icon: Dog,
    image: "/projects/paws/paws-1.jpg",
    pm: "PM: Aarav Jain",
    semester: "Fall 2026",
    readmeUrl: "/projects/paws",
  },
  {
    slug: "carbon-sink",
    title: "Carbon Sink",
    description:
      "A near-vehicle-scale carbon capture system that uses calcium hydroxide to pull CO₂ from motor-vehicle exhaust and cut tailpipe emissions.",
    technologies: ["Sensors", "Filtration"],
    status: "Active",
    icon: Leaf,
    image: "/projects/carbon-sink/carbon-sink-1.jpg",
    pm: "PM: Elias Braun",
    semester: "Fall 2026",
    readmeUrl: "/projects/carbon-sink",
  },
  {
    slug: "caissa",
    title: "CAISSA (Robotic Chess Board)",
    description:
      "A robotic chess board that plays you without a CPU—a neural network wired directly into the board's circuitry reads your move with Hall-effect sensors and slides its reply across the board on a hidden gantry.",
    technologies: ["SystemVerilog", "FPGA", "PyTorch", "KiCad"],
    status: "Active",
    icon: Crown,
    image: "/projects/caissa/caissa-1.jpg",
    pm: "PMs: Abhiraj Singh Jaswal, Aadithya Vasudevan",
    semester: "Fall 2026",
    readmeUrl: "/projects/caissa",
  },
  {
    slug: "wall-e",
    title: "WALL-E",
    description:
      "A life-sized, autonomous WALL-E robot that navigates its surroundings, responds to voice commands, and uses computer vision to find, collect, and crush trash—built on an NVIDIA Jetson Orin Nano.",
    technologies: ["NVIDIA Jetson", "Computer Vision", "Machine Learning", "ROS", "Embedded C/C++", "CAD"],
    status: "Active",
    icon: Bot,
    image: "/projects/wall-e/wall-e-1.jpg",
    pm: "PM: Thai Tran",
    semester: "Fall 2026",
    readmeUrl: "/projects/wall-e",
  },
  {
    slug: "slayterhil",
    title: "SlayterHiL (Hardware-in-the-Loop)",
    description:
      "A hardware-in-the-loop testbed for drone flight controllers that runs the full pipeline—test generation, sensor emulation, and the drone itself—so flight code is validated in software before it ever flies.",
    technologies: ["RTOS", "Embedded C/C++", "Raspberry Pi", "HIL Testing"],
    status: "Active",
    icon: Cpu,
    image: "/site-media/projects/slayterhil.webp",
    pm: "PM: Evin Lodder",
    semester: "Fall 2026",
    readmeUrl: "/projects/slayterhil",
  },
  {
    slug: "hesitation",
    title: "Hesitation (NEP Testbed)",
    description:
      "A nuclear electric propulsion (NEP) testbed that recreates and studies the SR-1 missions through real propulsion hardware and control systems.",
    technologies: ["FPGA", "Microcontrollers", "RTOS", "Machine Learning"],
    status: "Active",
    icon: Rocket,
    image: "/projects/hesitation/hesitation-1.jpg",
    pm: "PM: Arman Islam",
    semester: "Fall 2026",
    readmeUrl: "/projects/hesitation",
  },
  {
    slug: "irltspice",
    title: "IRLTSPICE",
    description:
      "A configurable analog circuit that brings digital ease to analog design—draw a circuit, compile it, flash the board, and your exact design is created in real life with no simulation or breadboarding. Think FPGA, but for analog.",
    technologies: ["Analog", "STM32", "Embedded C/C++"],
    status: "Active",
    icon: CircuitBoard,
    image: "/projects/irltspice/irltspice-1.jpg",
    pm: "PMs: Parker Hitchcock, Zach DeNeve, Clayton Hughes, Craig Eagleburger",
    semester: "Fall 2026",
    readmeUrl: "/projects/irltspice",
  },
  {
    slug: "intellithings",
    title: "IntelliThings",
    description:
      "An AIoT smart home where ESP32-C6 sensor nodes track the environment and presence while an LLM agent reasons over the data and controls the home through Home Assistant and MCP—no hand-written automation rules.",
    technologies: ["ESP32", "Rust", "ESP-IDF", "LLM / AI", "KiCad", "Wireless"],
    status: "Active",
    icon: House,
    image: "/projects/intellithings/intellithings-1.jpg",
    pm: "PMs: Yao Yang, Rakshita Gupta",
    semester: "Fall 2026",
    readmeUrl: "/projects/intellithings",
  },
  {
    slug: "boilerslam",
    title: "BoilerSLAM",
    description:
      "A handheld LiDAR SLAM sensor built on a Raspberry Pi 5 and Livox Mid-360 that generates real-time 3D maps of GPS-denied spaces like caves and tunnels by fusing point-cloud and inertial data.",
    technologies: ["Raspberry Pi", "ROS", "LiDAR", "Embedded C/C++", "PCB Design"],
    status: "Active",
    icon: Radar,
    image: "/projects/boilerslam/boilerslam-1.jpg",
    pm: "PMs: Patrick Jordan, Matthew Shams",
    semester: "Fall 2026",
    readmeUrl: "/projects/boilerslam",
  },
  {
    slug: "modularmidi",
    title: "ModularMIDI",
    description:
      "A MIDI controller made of customizable, magnetically interlocking segments that snap together for a flexible, scalable, and accessible instrument.",
    technologies: ["Microcontrollers", "Sensors", "MIDI"],
    status: "Active",
    icon: Music,
    image: "/projects/modularmidi/modularmidi-1.jpg",
    pm: "PM: Bosco Lee",
    semester: "Fall 2026",
    readmeUrl: "/projects/modularmidi",
  },
  {
    slug: "bb8",
    title: "BB-8 (Spherical Robot)",
    description:
      "A self-balancing spherical robot inspired by Star Wars' BB-8, driven by an ESP32, IMU, and custom drive hardware with 3D-printed and machined parts.",
    technologies: ["ESP32", "IMU", "3D Printing"],
    status: "Active",
    icon: Orbit,
    image: "/projects/bb8/bb8-1.jpg",
    pm: "PM: Patton Lee",
    semester: "Fall 2026",
    readmeUrl: "/projects/bb8",
  },
  {
    slug: "field-vision",
    title: "Field Vision",
    description:
      "An athletic concussion-detection system that pairs a sideline binocular camera with an in-helmet sensor to catch head impacts as they happen.",
    technologies: ["ESP-IDF", "OpenCV", "Computer Vision", "KiCad", "Embedded C/C++", "Python"],
    status: "Active",
    icon: Camera,
    image: "/projects/field-vision/field-vision-1.jpg",
    pm: "PMs: William Ramsey, Arvindh Krishna",
    semester: "Fall 2026",
    readmeUrl: "/projects/field-vision",
  },
  {
    slug: "vibeclone",
    title: "VibeClone",
    description:
      "An open-source software project that clones existing applications using AI throughout both the build process and the app's own features.",
    technologies: ["LLM / AI", "Full-Stack", "Automation"],
    status: "Active",
    icon: Sparkles,
    image: "/projects/vibeclone/vibeclone-1.jpg",
    pm: "PM: Gillian Hanley",
    semester: "Fall 2026",
    readmeUrl: "/projects/vibeclone",
  },

  // ───────────────────────── Completed · archive ─────────────────────────
  {
    slug: "harmonicore",
    title: "HarmoniCore (FPGA DSP Autotune)",
    description: "FPGA-based DSP core that autotunes your voice in real time.",
    technologies: ["FPGA", "Python", "PCB Design", "Audio"],
    status: "Completed",
    icon: Zap,
    image: "/site-media/projects/harmonicore.webp",
    pm: "PM: Varun Vaidyanathan",
    semester: "Fall 2025",
    readmeUrl: "/projects/harmonicore",
  },
  {
    slug: "eyecue",
    title: "EyeCue (Hands-Free Pointer)",
    description:
      "Blink/eyebrow/gaze-driven cursor using CV on Pi; accessibility oriented.",
    technologies: ["Computer Vision", "Raspberry Pi", "Python", "CAD"],
    status: "Completed",
    icon: Camera,
    image: "/site-media/projects/eyecue.webp",
    pm: "PMs: Katherine M, Garima T, Aarushi D, Shruthi A",
    semester: "Fall 2025",
    readmeUrl: "/projects/eyecue",
  },
  {
    slug: "micropiano",
    title: "MicroPiano",
    description:
      "Mini piano using hall sensors and an STM32; analog front-end + KiCad.",
    technologies: ["STM32", "Analog", "KiCad", "CAD"],
    status: "Completed",
    icon: Zap,
    image: "/projects/logo.png",
    pm: "PMs: Alex Forrest, Alexander Rizzi",
    semester: "Fall 2025",
    readmeUrl: "/projects/micropiano",
  },
  {
    slug: "berryweather",
    title: "BerryWeather (IoT Weather Station)",
    description:
      "Sensor-equipped wireless weather station on Pi/MCU with power-conscious design.",
    technologies: ["Raspberry Pi", "Sensors", "Embedded C/C++", "PCB Design"],
    status: "Completed",
    icon: Wifi,
    image: "/projects/logo.png",
    pm: "PM: Connor Powell",
    semester: "Fall 2025",
    readmeUrl: "/projects/berryweather",
  },
  {
    slug: "digital-ops",
    title: "Digital Operations",
    description:
      "Club website + workflow automation for media intake and requests.",
    technologies: ["TypeScript", "Full-Stack", "Automation"],
    status: "Completed",
    icon: Cpu,
    image: "/site-media/projects/digital-ops.webp",
    pm: "PM: Trevor Antle",
    semester: "Fall 2025",
    readmeUrl: "/projects/digital-ops",
  },
  {
    slug: "smart-watch",
    title: "Smart Watch",
    description:
      "A smart watch for the people! Build your own wearable with ESP32, sensors, and custom firmware.",
    technologies: ["ESP32", "PCB Design", "Sensors", "Wireless", "App Design"],
    status: "Completed",
    icon: Watch,
    image: "/projects/logo.png",
    pm: "PM: Patrick Shea",
    semester: "Fall 2025",
    readmeUrl: "/projects/smart-watch",
  },
  {
    slug: "gest",
    title: "Gest",
    description:
      "Gest senses your movements and your device responds instantly. That's what it means to #GestUp!",
    technologies: ["Wireless", "Microcontrollers", "Sensors", "IMU", "App Design"],
    status: "Completed",
    icon: Wifi,
    image: "/site-media/projects/gest.webp",
    pm: "PM: Jain Iftesam",
    semester: "Spring 2025",
    readmeUrl: "/projects/gest",
  },
  {
    slug: "purdudraw",
    title: "PurduDraw",
    description:
      "A modern embedded take on a classic mechanical drawing toy—accurate, fully functioning drawing robot.",
    technologies: ["Wireless", "Microcontrollers", "Sensors", "IMU", "App Design"],
    status: "Completed",
    icon: Wifi,
    image: "/site-media/projects/purdudraw.webp",
    pm: "PM: Connor Powell",
    semester: "Spring 2025",
    readmeUrl: "/projects/purdudraw",
  },
  {
    slug: "mssd",
    title: "MSSD",
    description:
      "Mechanical Seven Segment Display that flips mechanical segments using a notched, servo-driven shaft.",
    technologies: ["Wireless", "Microcontrollers", "Sensors", "IMU", "App Design"],
    status: "Completed",
    icon: Wifi,
    image: "/site-media/projects/mssd.webp",
    pm: "PM: Tom Concannon",
    semester: "Spring 2025",
    readmeUrl: "/projects/mssd",
  },
];

export const allStatuses: Array<Project["status"]> = ["Active", "Planned", "Completed"];

export function collectTechs(list: Project[]) {
  return Array.from(new Set(list.flatMap((p) => p.technologies))).sort((a, b) => a.localeCompare(b));
}
export function collectSemesters(list: Project[]) {
  return Array.from(new Set(list.map((p) => p.semester).filter(Boolean) as string[])).sort((a, b) =>
    a.localeCompare(b)
  );
}

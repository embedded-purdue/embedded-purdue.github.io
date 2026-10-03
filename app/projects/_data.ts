// app/projects/_data.ts
import {
  Antenna,
  Binary,
  Bot,
  BrainCircuit,
  Cable,
  Camera,
  Car,
  CircuitBoard,
  Cpu,
  Gauge,
  Crown,
  Dog,
  House,
  Leaf,
  Music,
  Orbit,
  Gamepad2,
  Radar,
  Radio,
  Settings,
  Smartphone,
  Watch,
  Waves,
  Wifi,
  Rocket,
  Sparkles,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import projectEntries from "@/content/projects.json";
import { type ProjectIconKey } from "@/lib/project-icon-keys";

export type Project = {
  slug: string;
  title: string;
  description?: string;
  technologies: string[];
  status: "Active" | "Planned" | "Completed";
  iconKey?: ProjectIconKey;
  icon?: LucideIcon;
  image?: string;
  images?: string[];
  pm?: string;
  pms?: string[];
  semester?: string;
  readmeUrl?: string;
};

const projectIcons: Record<ProjectIconKey, LucideIcon> = {
  cpu: Cpu,
  zap: Zap,
  wifi: Wifi,
  camera: Camera,
  car: Car,
  watch: Watch,
  "circuit-board": CircuitBoard,
  bot: Bot,
  radio: Radio,
  antenna: Antenna,
  gauge: Gauge,
  gamepad: Gamepad2,
  "brain-circuit": BrainCircuit,
  cable: Cable,
  wrench: Wrench,
  binary: Binary,
  smartphone: Smartphone,
  waves: Waves,
  settings: Settings,
  crown: Crown,
  dog: Dog,
  house: House,
  leaf: Leaf,
  music: Music,
  orbit: Orbit,
  radar: Radar,
  rocket: Rocket,
  sparkles: Sparkles,
};

type ProjectEntry = Omit<Project, "icon" | "iconKey"> & { icon?: ProjectIconKey };

function splitProjectManagers(value: string | undefined) {
  return (value || "").replace(/^PMs?:\s*/i, "").split(/[,\n]+/).map((entry) => entry.trim()).filter(Boolean);
}

export const projects: Project[] = (projectEntries as ProjectEntry[]).map((project) => {
  const pms = project.pms?.length ? project.pms : splitProjectManagers(project.pm);
  const images = Array.from(new Set([...(project.images || []), project.image || ""].map((image) => image.trim()).filter(Boolean)));
  return {
    ...project,
    images,
    image: project.image || images[0],
    pms,
    pm: project.pm || pms.join(", "),
    iconKey: project.icon,
    icon: project.icon ? projectIcons[project.icon] : undefined,
  };
});

export const allStatuses: Array<Project["status"]> = ["Active", "Planned", "Completed"];

export function collectTechs(list: Project[]) {
  return Array.from(new Set(list.flatMap((p) => p.technologies))).sort((a, b) => a.localeCompare(b));
}

export function collectSemesters(list: Project[]) {
  return Array.from(new Set(list.map((p) => p.semester).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

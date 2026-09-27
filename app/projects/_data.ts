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
  Gamepad2,
  Radio,
  Settings,
  Smartphone,
  Watch,
  Waves,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import projectEntries from "@/content/projects.json";

export type ProjectIconKey = "cpu" | "zap" | "wifi" | "camera" | "car" | "watch" | "circuit-board" | "bot" | "radio" | "antenna" | "gauge" | "gamepad" | "brain-circuit" | "cable" | "wrench" | "binary" | "smartphone" | "waves" | "settings";

export type Project = {
  slug: string;
  title: string;
  description?: string;
  technologies: string[];
  status: "Active" | "Planned" | "Completed";
  iconKey?: ProjectIconKey;
  icon?: LucideIcon;
  image?: string;
  pm?: string;
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
};

type ProjectEntry = Omit<Project, "icon" | "iconKey"> & { icon?: ProjectIconKey };

export const projects: Project[] = (projectEntries as ProjectEntry[]).map((project) => ({
  ...project,
  iconKey: project.icon,
  icon: project.icon ? projectIcons[project.icon] : undefined,
}));

export const allStatuses: Array<Project["status"]> = ["Active", "Planned", "Completed"];

export function collectTechs(list: Project[]) {
  return Array.from(new Set(list.flatMap((p) => p.technologies))).sort((a, b) => a.localeCompare(b));
}

export function collectSemesters(list: Project[]) {
  return Array.from(new Set(list.map((p) => p.semester).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

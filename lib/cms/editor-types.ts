import type { ProjectIconKey } from "@/lib/project-icon-keys";

export type ProjectContent = {
  slug: string;
  title: string;
  description?: string;
  technologies: string[];
  status: "Active" | "Planned" | "Completed";
  icon?: ProjectIconKey;
  image?: string;
  images?: string[];
  pm?: string;
  pms?: string[];
  semester?: string;
  readmeUrl?: string;
};

export type TeamSection = "exec" | "committee" | "pm" | "member";

export type TeamMemberContent = {
  name: string;
  role?: string;
  roles: string[];
  section: TeamSection;
  level: "exec" | "pm" | "admin" | "member";
  email?: string;
  linkedin?: string;
  github?: string;
  image?: string;
  order: number;
  active: boolean;
};

export type WorkshopContent = {
  slug: string;
  title: string;
  date?: string;
  location?: string;
  summary?: string;
  tags: string[];
  cover?: string;
  body: string;
};

export type CmsSnapshot = {
  baseBranch: string;
  baseCommitSha: string | null;
  projects: ProjectContent[];
  team: TeamMemberContent[];
  workshops: WorkshopContent[];
};

export type CmsAsset = {
  path: string;
  contentBase64: string;
  encoding: "base64";
};

export type PublishMode = "pr" | "direct";
export type Tab = "projects" | "team" | "workshops" | "preview" | "assets";

export type PublishResult = {
  branch: string;
  commitSha: string;
  branchUrl?: string;
  pullRequestUrl?: string;
  warning?: string;
};

export type ChangeKind = "added" | "updated" | "removed" | "uploaded";

export type ChangeSummary = {
  label: string;
  path: string;
  kind: ChangeKind;
  item: string;
  fields?: string[];
  beforeLabel?: string;
  afterLabel?: string;
};

export type CmsDirectoryItem = {
  label: string;
  detail: string;
  badge?: string;
  target?: { kind: "project" | "team" | "workshop"; index: number };
  tabTarget?: Tab;
};

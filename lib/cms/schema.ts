import { z } from "zod";

export const projectIconSchema = z.enum([
  "cpu", "zap", "wifi", "camera", "car", "watch", "circuit-board", "bot", "radio", "antenna", "gauge", "gamepad", "brain-circuit", "cable", "wrench", "binary", "smartphone", "waves", "settings",
]);
export const projectStatusSchema = z.enum(["Active", "Planned", "Completed"]);
export const slugSchema = z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

export const projectSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1),
  description: z.string().trim().optional().or(z.literal("")),
  technologies: z.array(z.string().trim().min(1)).default([]),
  status: projectStatusSchema,
  icon: projectIconSchema.optional(),
  image: z.string().trim().optional().or(z.literal("")),
  pm: z.string().trim().optional().or(z.literal("")),
  pms: z.array(z.string().trim().min(1)).default([]),
  semester: z.string().trim().optional().or(z.literal("")),
  readmeUrl: z.string().trim().optional().or(z.literal("")),
});

export const teamMemberSchema = z.object({
  name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  level: z.enum(["exec", "pm", "admin", "member"]).default("member"),
  email: z.string().trim().email().optional().or(z.literal("")),
  linkedin: z.string().trim().url().optional().or(z.literal("")),
  github: z.string().trim().url().optional().or(z.literal("")),
  image: z.string().trim().optional().or(z.literal("")),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const workshopSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1),
  date: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  summary: z.string().trim().optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1)).default([]),
  cover: z.string().trim().optional().or(z.literal("")),
  body: z.string().default(""),
});

export const cmsAssetSchema = z.object({
  path: z.string().trim().min(1).regex(/^(public|content)\/[a-zA-Z0-9/_.,+@%=-]+$/, "Asset path must stay inside public/ or content/."),
  contentBase64: z.string().min(1),
  encoding: z.literal("base64").default("base64"),
});

export const cmsSnapshotSchema = z.object({
  baseBranch: z.string(),
  baseCommitSha: z.string().nullable(),
  projects: z.array(projectSchema),
  team: z.array(teamMemberSchema),
  workshops: z.array(workshopSchema),
});

export const cmsPublishSchema = cmsSnapshotSchema.extend({
  mode: z.enum(["pr", "direct"]),
  message: z.string().trim().min(1).max(140),
  assets: z.array(cmsAssetSchema).default([]),
});

export type ProjectContent = z.infer<typeof projectSchema>;
export type TeamMemberContent = z.infer<typeof teamMemberSchema>;
export type WorkshopContent = z.infer<typeof workshopSchema>;
export type CmsSnapshot = z.infer<typeof cmsSnapshotSchema>;
export type CmsPublishPayload = z.infer<typeof cmsPublishSchema>;

export const PROJECTS_PATH = "content/projects.json";
export const TEAM_PATH = "content/team.json";
export const WORKSHOPS_DIR = "content/workshops";

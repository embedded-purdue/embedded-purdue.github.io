import { normalizeProject } from "./normalize";
import {
  PROJECTS_PATH,
  TEAM_PATH,
  teamMemberSchema,
  WORKSHOPS_DIR,
  workshopSchema,
  type CmsPublishPayload,
  type WorkshopContent,
} from "./schema";

type CmsFile = { path: string; content: string; encoding?: "utf-8" | "base64" };

function yamlScalar(value: string) {
  return JSON.stringify(value);
}

function yamlStringArray(values: string[]) {
  return values.map((value) => `  - ${yamlScalar(value)}`).join("\n");
}

function workshopFrontmatter(workshop: WorkshopContent) {
  const lines = [
    `title: ${yamlScalar(workshop.title)}`,
    `slug: ${yamlScalar(workshop.slug)}`,
  ];
  if (workshop.date) lines.push(`date: ${yamlScalar(workshop.date)}`);
  if (workshop.location)
    lines.push(`location: ${yamlScalar(workshop.location)}`);
  if (workshop.summary) lines.push(`summary: ${yamlScalar(workshop.summary)}`);
  if (workshop.tags.length)
    lines.push(`tags:\n${yamlStringArray(workshop.tags)}`);
  if (workshop.cover) lines.push(`cover: ${yamlScalar(workshop.cover)}`);
  return lines.join("\n");
}

function stringifyWorkshop(workshop: WorkshopContent) {
  const body = workshop.body.trim();
  return `---\n${workshopFrontmatter(workshop)}\n---\n\n${body}${body ? "\n" : ""}`;
}

export function buildCmsFiles(payload: CmsPublishPayload): CmsFile[] {
  const files: CmsFile[] = [
    {
      path: PROJECTS_PATH,
      content: `${JSON.stringify(payload.projects.map(normalizeProject), null, 2)}\n`,
      encoding: "utf-8",
    },
    {
      path: TEAM_PATH,
      content: `${JSON.stringify(
        payload.team.map((entry) => teamMemberSchema.parse(entry)),
        null,
        2,
      )}\n`,
      encoding: "utf-8",
    },
  ];

  for (const workshop of payload.workshops.map((entry) =>
    workshopSchema.parse(entry),
  )) {
    files.push({
      path: `${WORKSHOPS_DIR}/${workshop.slug}.md`,
      content: stringifyWorkshop(workshop),
      encoding: "utf-8",
    });
  }

  for (const asset of payload.assets)
    files.push({
      path: asset.path,
      content: asset.contentBase64,
      encoding: "base64",
    });
  return files;
}

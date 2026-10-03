import { projectSchema, type ProjectContent } from "./schema";

export function splitProjectManagers(value: string | undefined) {
  return (value || "")
    .replace(/^PMs?:\s*/i, "")
    .split(/[,\n]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function normalizeProject(entry: unknown): ProjectContent {
  const parsed = projectSchema.parse(entry);
  const pms = parsed.pms.length ? parsed.pms : splitProjectManagers(parsed.pm);
  const images = Array.from(
    new Set(
      [...(parsed.images || []), parsed.image || ""]
        .map((image) => image.trim())
        .filter(Boolean),
    ),
  );
  return {
    ...parsed,
    images,
    image: parsed.image || images[0] || "",
    pms,
    pm: pms.join(", "),
  };
}

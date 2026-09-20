const SHARED_PROJECT_PLACEHOLDER = "/projects/logo.png"

export function resolveProjectImagePath(slug: string, image?: string | null) {
  const raw = image?.trim()
  if (!raw) return SHARED_PROJECT_PLACEHOLDER
  if (/^https?:\/\//i.test(raw)) return raw

  const normalized = `/${raw.replace(/^\/+/, "")}`
  if (normalized === SHARED_PROJECT_PLACEHOLDER) return normalized
  if (normalized.startsWith("/site-media/")) return normalized
  if (normalized.startsWith(`/projects/${slug}/`)) return normalized

  const projectRelative = normalized.startsWith("/projects/")
    ? normalized.slice("/projects/".length)
    : normalized.slice(1)

  return `/projects/${slug}/${projectRelative}`
}

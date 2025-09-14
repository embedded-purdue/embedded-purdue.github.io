import { defineCollection, z } from "astro:content"

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
})

const workshops = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    instructor: z.string().optional(),
    duration: z.string().optional(),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    tags: z.array(z.string()).optional(),
    materials: z.array(z.string()).optional(),
  }),
})

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lastUpdated: z.date().optional(),
    author: z.string().optional(),
  }),
})

export const collections = {
  blog,
  workshops,
  pages,
}

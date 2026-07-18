import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      category: z.string(),
      date: z.coerce.date(),
      image: image().optional(),
    }),
});

export const collections = { blog };

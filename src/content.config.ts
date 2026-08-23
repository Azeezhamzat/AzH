import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
    readingTime: z.string(),
    coverTone: z.enum(['ochre', 'sage', 'blue', 'clay', 'plum']),
    featured: z.boolean().default(false),
  }),
});

export const collections = { writing };

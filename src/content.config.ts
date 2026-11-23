import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pieces = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/pieces', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) =>
    z.object({
      no: z.number().int().positive(),
      title: z.string(),
      subtitle: z.string().optional(),
      date: z.coerce.date(),
      lang: z.enum(['en', 'id']),
      shelf: z.enum(['tender-things', 'against-the-grain', 'songs-and-tributes']),
      cover: image(),
      coverAlt: z.string().default(''),
      substack: z.string().url(),
    }),
});

export const collections = { pieces };

import * as z from 'zod';

export const TagSchema = z.object({
  userId: z.number(),
  type: z.enum(['cost', 'income']),
  title: z.string(),
});

export type Tag = z.infer<typeof TagSchema>;

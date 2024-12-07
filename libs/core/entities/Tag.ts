import { z } from 'zod';

import { userSchema } from './User';

export const tagSchema = z.object({
  id: z.string(),
  userId: userSchema.pick({ id: true }),
  type: z.enum(['cost', 'income']),
  title: z.string(),
});

export type Tag = z.infer<typeof tagSchema>;

import * as z from 'zod';

import { UserSchema } from './User';

export const TagSchema = z.object({
  id: z.string(),
  userId: UserSchema.shape.id,
  type: z.enum(['cost', 'income']),
  title: z.string(),
});

export type Tag = z.infer<typeof TagSchema>;

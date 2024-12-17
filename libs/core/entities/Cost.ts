import { z } from 'zod';

import { userSchema } from './User';
import { fundSchema } from './Fund';

export const costSchema = z.object({
  id: z.string(),
  userId: userSchema.shape.id,
  fundId: fundSchema.shape.id,
  note: z.string().nullable(),
  amount: z.number().positive(),
  date: z.number().int(),
});

export type Cost = z.infer<typeof costSchema>;

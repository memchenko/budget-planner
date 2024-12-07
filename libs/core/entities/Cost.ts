import { z } from 'zod';

import { userSchema } from './User';
import { fundSchema } from './Fund';

export const costSchema = z.object({
  id: z.string(),
  userId: userSchema.pick({ id: true }),
  fundId: fundSchema.pick({ id: true }),
  note: z.string().nullable(),
  amount: z.number().positive(),
  date: z.number().int(),
});

export type Cost = z.infer<typeof costSchema>;

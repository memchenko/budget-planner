import { z } from 'zod';

import { userSchema } from './User';

export const incomeSchema = z.object({
  id: z.string(),
  userId: userSchema.shape.id,
  note: z.string().nullable(),
  amount: z.number().positive(),
  date: z.number().int(),
});

export type Income = z.infer<typeof incomeSchema>;

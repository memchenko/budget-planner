import * as z from 'zod';

import { UserSchema } from './User';

export const IncomeSchema = z.object({
  id: z.string(),
  userId: UserSchema.shape.id,
  note: z.string().nullable(),
  amount: z.number(),
});

export type Income = z.infer<typeof IncomeSchema>;

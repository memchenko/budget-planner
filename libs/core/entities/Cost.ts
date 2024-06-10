import * as z from 'zod';

import { UserSchema } from './User';

export const CostSchema = z.object({
  id: z.string(),
  userId: UserSchema.shape.id,
  fundId: z.string(),
  note: z.string().nullable(),
  amount: z.number(),
});

export type Cost = z.infer<typeof CostSchema>;

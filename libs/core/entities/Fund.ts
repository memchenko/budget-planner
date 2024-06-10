import * as z from 'zod';

import { UserSchema } from './User';

export const FundSchema = z.object({
  id: z.string(),
  isMain: z.boolean(),
  userId: UserSchema.shape.id,
  title: z.string().nullable(),
  balance: z.number(),
  priority: z.number(),
  capacity: z.number().nullable(),
});

export type Fund = z.infer<typeof FundSchema>;

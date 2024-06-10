import * as z from 'zod';

import { UserSchema } from './User';

export const FundSchema = z.object({
  id: z.string(),
  isMain: z.boolean(),
  userId: UserSchema.shape.id,
  title: z.string().nullable(),
  balance: z.number(),
  priority: z.number(),
  capacity: z.number(),
  // whether balance of the fund should
  // stay in the fund or go into main fund
  // in the beginning of a new month
  isCumulative: z.boolean(),
  // whether negative balance should be
  // covered by balance from main fund
  isEager: z.boolean(),
});

export type Fund = z.infer<typeof FundSchema>;

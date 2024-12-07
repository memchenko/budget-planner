import { z } from 'zod';

import { userSchema } from './User';

export const fundSchema = z.object({
  id: z.string(),
  isMain: z.boolean(),
  userId: userSchema.pick({ id: true }),
  title: z.string(),
  balance: z.number(),
  priority: z.number().int().positive(),
  capacity: z.number().positive(),
  // whether balance of the fund should
  // stay in the fund or go into main fund
  // in the beginning of a new month
  isCumulative: z.boolean(),
  // whether negative balance should be
  // covered by balance from main fund
  isEager: z.boolean(),
  // view setting
  calculateDailyLimit: z.boolean(),
});

export type Fund = z.infer<typeof fundSchema>;

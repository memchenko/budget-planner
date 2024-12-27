import { z } from 'zod';

import { userSchema } from './User';
import { walletSchema } from './Wallet';

export const fundSchema = z.object({
  id: z.string(),
  userId: userSchema.shape.id,
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
  // external wallet the fund relates to
  // May be move it to ProjectionRule?
  externalWalletId: walletSchema.shape.id.nullable(),
});

export type Fund = z.infer<typeof fundSchema>;

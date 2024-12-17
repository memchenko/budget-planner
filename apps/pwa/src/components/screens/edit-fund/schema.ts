import { z } from 'zod';

export const schema = z
  .object({
    name: z.string().min(1),
    capacity: z.number().int().positive(),
    balance: z.number().positive(),
    isCumulative: z.boolean(),
    takeDeficitFromWallet: z.boolean(),
    calculateDailyLimit: z.boolean(),
  })
  .partial();

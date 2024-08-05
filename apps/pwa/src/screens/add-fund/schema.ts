import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().positive(),
  initialBalance: z.number().positive().optional(),
  isCumulative: z.boolean().optional(),
  takeDeficitFromWallet: z.boolean().optional(),
  calculateDailyLimit: z.boolean().optional(),
});

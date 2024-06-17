import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().positive(),
  priority: z.number().int().positive().optional(),
  initialBalance: z.number().int().positive().optional(),
  isCumulative: z.boolean().optional(),
  takeDeficitFromWallet: z.boolean().optional(),
  calculateDailyLimit: z.boolean().optional(),
});

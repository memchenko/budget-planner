import * as z from 'zod';

export const FundSchema = z.object({
  id: z.string(),
  userId: z.number(),
  title: z.string(),
  balance: z.number(),
  priority: z.number(),
  capacity: z.number(),
  calculateDailyLimit: z.boolean(),
});

export type Fund = z.infer<typeof FundSchema>;

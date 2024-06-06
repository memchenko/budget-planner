import * as z from 'zod';

export const CostSchema = z.object({
  id: z.string(),
  userId: z.number(),
  fundId: z.string(),
  note: z.string(),
  category: z.string(),
  amount: z.number(),
});

export type Cost = z.infer<typeof CostSchema>;

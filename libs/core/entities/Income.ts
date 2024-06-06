import * as z from 'zod';

export const IncomeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  note: z.string().optional(),
  category: z.string(),
  amount: z.number(),
});

export type Income = z.infer<typeof IncomeSchema>;

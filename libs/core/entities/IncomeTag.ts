import { z } from 'zod';

import { incomeSchema } from './Income';
import { tagSchema } from './Tag';

export const incomeTagSchema = z.object({
  incomeId: incomeSchema.shape.id,
  tagId: tagSchema.shape.id,
});

export type IncomeTag = z.infer<typeof incomeTagSchema>;

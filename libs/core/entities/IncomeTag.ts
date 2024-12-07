import { z } from 'zod';

import { incomeSchema } from './Income';
import { tagSchema } from './Tag';

export const incomeTagSchema = z.object({
  incomeId: incomeSchema.pick({ id: true }),
  tagId: tagSchema.pick({ id: true }),
});

export type IncomeTag = z.infer<typeof incomeTagSchema>;

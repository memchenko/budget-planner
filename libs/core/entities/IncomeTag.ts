import * as z from 'zod';

import { IncomeSchema } from './Income';
import { TagSchema } from './Tag';

export const IncomeTagSchema = z.object({
  incomeId: IncomeSchema.shape.id,
  tagId: TagSchema.shape.id,
});

export type IncomeTag = z.infer<typeof IncomeTagSchema>;

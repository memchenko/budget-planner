import * as z from 'zod';

import { CostSchema } from './Cost';
import { TagSchema } from './Tag';

export const CostTagSchema = z.object({
  costId: CostSchema.shape.id,
  tagId: TagSchema.shape.id,
});

export type CostTag = z.infer<typeof CostTagSchema>;

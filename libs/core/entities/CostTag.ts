import { z } from 'zod';

import { costSchema } from './Cost';
import { tagSchema } from './Tag';

export const costTagSchema = z.object({
  costId: costSchema.shape.id,
  tagId: tagSchema.shape.id,
});

export type CostTag = z.infer<typeof costTagSchema>;

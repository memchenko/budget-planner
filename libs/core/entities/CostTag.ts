import { z } from 'zod';

import { costSchema } from './Cost';
import { tagSchema } from './Tag';

export const costTagSchema = z.object({
  costId: costSchema.pick({ id: true }),
  tagId: tagSchema.pick({ id: true }),
});

export type CostTag = z.infer<typeof costTagSchema>;

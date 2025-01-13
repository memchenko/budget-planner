import { z } from 'zod';

export const entityAcceptedSchema = z.object({
  answer: z.boolean(),
  entityType: z.string(),
  entityId: z.string(),
});

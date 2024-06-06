import * as z from 'zod';

export const StateSchema = z.object({
  userId: z.number(),
  state: z.string().nullable(),
  responsesList: z.array(z.string()),
});

export type State = z.infer<typeof StateSchema>;

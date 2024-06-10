import * as z from 'zod';

export const FundSettingsSchema = z.object({});

export type FundSettings = z.infer<typeof FundSettingsSchema>;

import { z } from 'zod';

export const allEntities = z.enum(['user', 'fund', 'wallet', 'cost', 'income', 'tag']);

export const { user, fund, wallet, cost, income, tag } = allEntities.Enum;

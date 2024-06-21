import { Income } from './Income';
import { Tag } from './Tag';

export type IncomeTag = {
  incomeId: Income['id'];
  tagId: Tag['id'];
};

import { Cost } from './Cost';
import { Tag } from './Tag';

export type CostTag = {
  costId: Cost['id'];
  tagId: Tag['id'];
};

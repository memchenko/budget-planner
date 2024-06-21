import { User } from './User';

export type Tag = {
  id: string;
  userId: User['id'];
  type: 'cost' | 'income';
  title: string;
};

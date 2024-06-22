import { User } from './User';
import { Fund } from './Fund';

export type Cost = {
  id: string;
  userId: User['id'];
  fundId: Fund['id'];
  note: string | null;
  amount: number;
  date: number;
};

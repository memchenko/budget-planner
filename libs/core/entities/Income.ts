import { User } from './User';

export type Income = {
  id: string;
  userId: User['id'];
  note: string | null;
  amount: number;
};

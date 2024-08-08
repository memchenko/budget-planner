import { User } from './User';

export type Fund = {
  id: string;
  isMain: boolean;
  userId: User['id'];
  title: string;
  balance: number;
  priority: number;
  capacity: number;
  // whether balance of the fund should
  // stay in the fund or go into main fund
  // in the beginning of a new month
  isCumulative: boolean;
  // whether negative balance should be
  // covered by balance from main fund
  isEager: boolean;
  // view setting
  calculateDailyLimit: boolean;
};

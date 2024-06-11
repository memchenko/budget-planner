import { configureStore } from '@reduxjs/toolkit';
import * as costs from '../entities/cost';
import * as incomes from '../entities/income';
import * as funds from '../entities/fund';
import * as tags from '../entities/tag';
import * as users from '../entities/user';
import * as dictionaries from '../entities/dictionaries';

export const store = configureStore({
  reducer: {
    costs: costs.reducer,
    incomes: incomes.reducer,
    funds: funds.reducer,
    tags: tags.reducer,
    users: users.reducer,
    dictionaries: dictionaries.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

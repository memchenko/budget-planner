import { configureStore, combineSlices } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import * as costs from '../entities/cost';
import * as incomes from '../entities/income';
import * as funds from '../entities/fund';
import * as tags from '../entities/tag';
import * as users from '../entities/user';
import * as dictionaries from '../entities/dictionaries';
import * as scenarioRunner from '../services/scenarioRunner';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const reducer = combineSlices(
  costs.slice,
  incomes.slice,
  funds.slice,
  tags.slice,
  users.slice,
  dictionaries.slice,
  scenarioRunner.slice,
);

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(scenarioRunner.middleware);
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

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
import { container } from '../configs/inversify.config';
import { TOKENS } from '../lib/misc/di';

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
    });
  },
});

export const persistor = persistStore(store);

declare global {
  type Store = typeof store;
  type RootState = ReturnType<typeof store.getState>;
  type AppDispatch = typeof store.dispatch;
}

container.bind<Store>(TOKENS.Store).toConstantValue(store);
container.get<Store>(TOKENS.Store);

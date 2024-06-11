import { EntityState, Store } from '@reduxjs/toolkit';
import { costsAdapter, Cost } from './slice';

export type StateWithCosts = { costs: EntityState<Cost, 'id'> };

const costsSelectors = costsAdapter.getSelectors<StateWithCosts>((state) => state.costs);

export const getAllCosts = (store: Store) => costsSelectors.selectAll(store.getState());

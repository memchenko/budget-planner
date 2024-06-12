import { EntityState, Store } from '@reduxjs/toolkit';
import { adapter, EntityType, slice } from './slice';

const { name } = slice;

export type StateWithEntity = { [Key in typeof name]: EntityState<EntityType, 'id'> };

const selectors = adapter.getSelectors<StateWithEntity>((state) => state[name]);

export const getAll = (store: Store) => selectors.selectAll(store.getState());

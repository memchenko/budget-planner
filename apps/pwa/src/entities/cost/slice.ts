import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { entities } from '../../../../../libs/core';

export type Cost = entities.Cost & {
  createdAt: number;
  updatedAt: number;
};

export const costsAdapter = createEntityAdapter({
  selectId: (cost: Cost) => cost.id,
  sortComparer: (a, b) => b.createdAt - a.createdAt,
});

export const costsSlice = createSlice({
  name: 'costs',
  initialState: costsAdapter.getInitialState(),
  reducers: {
    create: costsAdapter.addOne,
    remove: costsAdapter.removeOne,
    removeMany: costsAdapter.removeMany,
    update: costsAdapter.updateOne,
    updateMany: costsAdapter.updateMany,
  },
});

export const { reducer, actions } = costsSlice;

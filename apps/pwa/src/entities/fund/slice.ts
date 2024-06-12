import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { entities } from '../../../../../libs/core';

export type EntityType = entities.Fund & {
  createdAt: number;
  updatedAt: number;
};

export const adapter = createEntityAdapter<EntityType, string>({
  selectId: (fund) => fund.id,
  sortComparer: (a, b) => b.createdAt - a.createdAt,
});

export const slice = createSlice({
  name: 'funds',
  initialState: adapter.getInitialState(),
  reducers: {
    create: adapter.addOne,
    remove: adapter.removeOne,
    removeMany: adapter.removeMany,
    update: adapter.updateOne,
    updateMany: adapter.updateMany,
  },
});

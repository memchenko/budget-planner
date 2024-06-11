import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { entities } from '../../../../../libs/core';

export type State = {
  // key is cost id
  costTags: Record<string, string[]>;
  // key is income id
  incomeTags: Record<string, string[]>;
};

const initialState: State = {
  costTags: {},
  incomeTags: {},
};

export const slice = createSlice({
  name: 'dictionaries',
  initialState,
  reducers: {
    addCategory(state, action: PayloadAction<{ id: string; type: entities.Tag['type']; tagId: string }>) {
      const { type, id, tagId } = action.payload;
      const key: keyof State = `${type}Tags`;
      const currentTags = state[key][id] ?? [];
      const tagsIds = currentTags.includes(tagId) ? currentTags : [...currentTags, tagId];

      return {
        ...state,
        [key]: {
          ...state[key],
          [id]: tagsIds,
        },
      };
    },
    removeCategory(state, action: PayloadAction<{ id: string; type: entities.Tag['type']; tagId: string }>) {
      const { type, id, tagId } = action.payload;
      const key: keyof State = `${type}Tags`;
      const currentTags = state[key][id] ?? [];
      const tagsIds = currentTags.filter((tag) => tag !== tagId);

      return {
        ...state,
        [key]: {
          ...state[key],
          [id]: tagsIds,
        },
      };
    },
    removeMany(state, action: PayloadAction<{ id: string; type: entities.Tag['type']; tagsIds: string[] }>) {
      const { id, type, tagsIds } = action.payload;
      const key: keyof State = `${type}Tags`;
      const currentTags = state[key][id] ?? [];
      const tagsIdsWithoutRemoved = currentTags.filter((tag) => !tagsIds.includes(tag));

      return {
        ...state,
        [key]: {
          ...state[key],
          [id]: tagsIdsWithoutRemoved,
        },
      };
    },
  },
});

export const { reducer, actions, name } = slice;

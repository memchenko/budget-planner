import { Store } from '@reduxjs/toolkit';
import { slice, State } from './slice';
import { entities } from '../../../../../libs/core';

const { name } = slice;

export type StateWithEntity = { [Key in typeof name]: State };

export const getDictionaries = (state: StateWithEntity) => {
  return state[name];
};

export const getCostTags = (state: StateWithEntity, costId: string) => {
  const dictionaries = getDictionaries(state);
  const dictionary = dictionaries.costTags;
  const tagsIds = dictionary[costId];

  return tagsIds.map((tagId) => ({ costId, tagId }));
};

export const getIncomeTags = (state: StateWithEntity, incomeId: string) => {
  const dictionaries = getDictionaries(state);
  const dictionary = dictionaries.incomeTags;
  const tagsIds = dictionary[incomeId];

  return tagsIds.map((tagId) => ({ incomeId, tagId }));
};

export const getAllByCategory = <
  C extends entities.Tag['type'],
  Result = C extends 'cost' ? entities.CostTag : entities.IncomeTag,
>(
  store: Store<StateWithEntity>,
  category: C,
) => {
  const dictionaries = getDictionaries(store.getState());
  const key: keyof State = `${category}Tags`;
  const dictionary = dictionaries[key];

  return Object.entries(dictionary).reduce((acc, entry) => {
    const [txId, tagsIds] = entry;
    const key = `${category}Id` as keyof Result;
    const entityTags = tagsIds.map((tagId) => ({ [key]: txId, tagId }) as Result);

    return acc.concat(entityTags);
  }, [] as Result[]);
};

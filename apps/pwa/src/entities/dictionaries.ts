import { makeAutoObservable, observable, action } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { entities } from '../../../../libs/core';
import { injectable } from 'inversify';

export type DictionariesState = {
  costTags: Record<entities.CostTag['costId'], entities.CostTag['tagId'][]>;
  incomeTags: Record<entities.IncomeTag['incomeId'], entities.CostTag['tagId'][]>;
};

@injectable()
export class Dictionaries {
  @observable costTags: DictionariesState['costTags'] = {};
  @observable incomeTags: DictionariesState['incomeTags'] = {};

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: this.constructor.name,
      properties: ['costTags', 'incomeTags'],
    });
  }

  @action
  addCategory(payload: { id: string; type: entities.Tag['type']; tagId: string }) {
    const { type, id, tagId } = payload;
    const key = `${type}Tags` as keyof DictionariesState;
    const currentTags = this[key][id] ?? [];
    const tagsIds = currentTags.includes(tagId) ? currentTags : [...currentTags, tagId];

    this[key][id] = tagsIds;
  }

  @action
  removeCategory(payload: { id: string; type: entities.Tag['type']; tagId: string }) {
    const { type, id, tagId } = payload;
    const key = `${type}Tags` as keyof DictionariesState;
    const currentTags = this[key][id] ?? [];
    const tagsIds = currentTags.filter((tag) => tag !== tagId);

    this[key][id] = tagsIds;
  }

  @action
  removeMany(payload: { id: string; type: entities.Tag['type']; tagsIds: string[] }) {
    const { id, type, tagsIds } = payload;
    const key = `${type}Tags` as keyof DictionariesState;
    const currentTags = this[key][id] ?? [];
    const tagsIdsWithoutRemoved = currentTags.filter((tag) => !tagsIds.includes(tag));

    this[key][id] = tagsIdsWithoutRemoved;
  }

  getCostTags(costId: string) {
    const tags = this.costTags[costId] ?? [];
    return tags.map((tagId) => ({ costId, tagId }));
  }

  getIncomeTags(incomeId: string) {
    const tags = this.incomeTags[incomeId] ?? [];
    return tags.map((tagId) => ({ incomeId, tagId }));
  }

  getAllByCategory<C extends entities.Tag['type'], Result = C extends 'cost' ? entities.CostTag : entities.IncomeTag>(
    category: C,
  ) {
    const key = `${category}Tags` as keyof DictionariesState;
    const dictionary = this[key];

    return Object.entries(dictionary).reduce((acc, entry) => {
      const [txId, tagsIds] = entry;
      const key = `${category}Id` as keyof Result;
      const entityTags = tagsIds.map((tagId) => ({ [key]: txId, tagId }) as Result);

      return acc.concat(entityTags);
    }, [] as Result[]);
  }
}

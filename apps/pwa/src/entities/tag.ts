import { makeAutoObservable, observable, action, computed } from 'mobx';
import { makePersistable, isHydrated } from 'mobx-persist-store';
import { entities } from '#/libs/core';
import { injectable, inject } from 'inversify';
import { Cost } from './cost';
import { Income } from './income';
import { Dictionaries } from './dictionaries';
import { TOKENS } from '~/shared/constants/di';
import { DateTime } from 'luxon';

export type EntityType = entities.Tag & {
  createdAt: number;
  updatedAt: number;
};

@injectable()
export class Tag {
  @observable entries: EntityType[] = [];

  constructor(
    @inject(TOKENS.COSTS_STORE) private cost: Cost,
    @inject(TOKENS.INCOMES_STORE) private income: Income,
    @inject(TOKENS.DICTIONARIES_STORE) private dictionaries: Dictionaries,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: this.constructor.name,
      properties: ['entries'],
    });
  }

  @action
  add(entity: EntityType) {
    this.entries.push(entity);
  }

  @action
  remove(id: EntityType['id']) {
    this.entries = this.entries.filter((entry) => entry.id !== id);
  }

  @action
  removeMany(ids: EntityType['id'][]) {
    this.entries = this.entries.filter((entry) => !ids.includes(entry.id));
  }

  @action
  update(updatedEntity: EntityType) {
    this.entries = this.entries.map((entry) => (entry.id === updatedEntity.id ? updatedEntity : entry));
  }

  @action
  updateMany(updatedEntities: EntityType[]) {
    updatedEntities.forEach((updatedEntity) => {
      this.entries = this.entries.map((entry) => (entry.id === updatedEntity.id ? updatedEntity : entry));
    });
  }

  getOneById(id: EntityType['id']) {
    return this.entries.find((tag) => tag.id === id);
  }

  getMostPopularTags(type: EntityType['type']) {
    const tags = this.entries.filter((tag) => tag.type === type);
    const now = DateTime.now().toMillis();
    const monthAgo = DateTime.now().minus({ month: 1 }).toMillis();
    const tagsIds: string[] = [];

    if (type === 'cost') {
      const entriesForMonth = this.cost.getCostByDateRange(monthAgo, now);
      const tagsIds = entriesForMonth.map((entry) => entry.id);
      const costTags = new Set(this.dictionaries.getCostTagsMany(tagsIds).map((tag) => tag.tagId));

      tagsIds.push(...costTags);
    } else {
      const entriesForMonth = this.income.getIncomeByDateRange(monthAgo, now);
      const tagsIds = entriesForMonth.map((entry) => entry.id);
      const incomeTags = new Set(this.dictionaries.getIncomeTagsMany(tagsIds).map((tag) => tag.tagId));

      tagsIds.push(...incomeTags);
    }

    return tags.filter((tag) => tagsIds.includes(tag.id));
  }

  getTagsBySubstring(substr: string, type: EntityType['type']) {
    return this.entries.filter((tag) => tag.type === type && tag.title.includes(substr));
  }

  getAllByType(type: EntityType['type']) {
    return this.entries.filter((tag) => tag.type === type);
  }

  hasTag(title: string, type: EntityType['type']) {
    return this.entries.some((tag) => tag.type === type && tag.title === title);
  }

  @computed
  get isReady() {
    return isHydrated(this);
  }

  @computed
  get all() {
    return this.entries;
  }
}

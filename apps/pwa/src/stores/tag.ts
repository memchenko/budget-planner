import { makeAutoObservable, observable, action, computed, when } from 'mobx';
import { makePersistable, isHydrated } from 'mobx-persist-store';
import { entities } from '#/libs/core';
import { injectable, inject } from 'inversify';
import { Cost } from './cost';
import { Income } from './income';
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
    @inject(TOKENS.COST_STORE) private cost: Cost,
    @inject(TOKENS.INCOME_STORE) private income: Income,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: this.constructor.name,
      properties: ['entries'],
    });

    let isMigrated = false;

    when(
      () => this.isReady,
      () => {
        const tagsWithoutId = this.entries.filter(({ id }) => id === undefined);

        if (tagsWithoutId.length > 0 && !isMigrated) {
          isMigrated = true;

          tagsWithoutId.forEach((tag, index) => {
            const tagIdx = this.entries.findIndex((entryTag) => tag === entryTag);

            if (tagIdx > -1) {
              this.entries[tagIdx].id = String(Date.now() + index * 10);
            }
          });
        }
      },
    );
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
      const tagsIds = entriesForMonth.flatMap((entry) => entry.tags);
      const costTags = new Set(tagsIds);

      tagsIds.push(...costTags);
    } else {
      const entriesForMonth = this.income.getIncomeByDateRange(monthAgo, now);
      const tagsIds = entriesForMonth.flatMap((entry) => entry.tags);
      const incomeTags = new Set(tagsIds);

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

  getAllByTypeAndParent(
    type: EntityType['type'],
    parentType: EntityType['entities'][number]['entity'],
    parentId: EntityType['entities'][number]['entityId'],
  ) {
    return this.getAllByType(type).filter(({ entities }) => {
      return entities.some(({ entity, entityId }) => entity === parentType && entityId === parentId);
    });
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

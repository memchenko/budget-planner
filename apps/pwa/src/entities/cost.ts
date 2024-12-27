import { makeAutoObservable, observable, action, computed } from 'mobx';
import { makePersistable, isHydrated } from 'mobx-persist-store';
import { injectable } from 'inversify';
import { entities } from '#/libs/core';
import { fund } from '#/libs/core/shared/schemas';

export type EntityType = entities.Cost & {
  createdAt: number;
  updatedAt: number;
};

@injectable()
export class Cost {
  @observable entries: EntityType[] = [];

  constructor() {
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

  @computed
  get isReady() {
    return isHydrated(this);
  }

  @computed
  get all() {
    return this.entries;
  }

  getCostByDateRange(from: number, to: number) {
    return this.entries.filter((entry) => entry.date >= from && entry.date <= to);
  }

  getCostsByFundAndDateRange(fundId: entities.Fund['id'], from: number, to: number) {
    return this.entries.filter(
      (entry) => entry.entity === fund && entry.entityId === fundId && entry.date >= from && entry.date <= to,
    );
  }
}

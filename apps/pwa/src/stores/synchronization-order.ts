import { makeAutoObservable, observable, action, computed } from 'mobx';
import { makePersistable, isHydrated } from 'mobx-persist-store';
import { entities } from '#/libs/core';
import { injectable } from 'inversify';

export type EntityType = entities.SynchronizationOrder & {
  createdAt: number;
  updatedAt: number;
};

@injectable()
export class SynchronizationOrder {
  @observable entries: EntityType[] = [];
  @observable syncingOrdersCount = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: this.constructor.name,
      properties: ['entries'],
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

  @computed
  get isSyncing() {
    return this.syncingOrdersCount > 0;
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
  upsert(entity: EntityType) {
    this.entries = this.entries.filter((entry) => entry.id !== entity.id).concat(entity);
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

  @action
  startSyncingOrder() {
    this.syncingOrdersCount++;
  }

  @action
  stopSyncingOrder() {
    this.syncingOrdersCount--;
  }

  getAllByUserId(userId: EntityType['userId']) {
    return this.all.filter((entry) => entry.userId === userId);
  }
}

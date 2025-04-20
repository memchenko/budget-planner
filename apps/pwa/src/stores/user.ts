import { makeAutoObservable, observable, action, computed } from 'mobx';
import { makePersistable, isHydrated } from 'mobx-persist-store';
import { entities } from '#/libs/core';
import { injectable } from 'inversify';

export type EntityType = entities.User & {
  createdAt: number;
  updatedAt: number;
};

@injectable()
export class User {
  @observable entries: EntityType[] = [];
  @observable connectedUsers = new Set<EntityType['id']>();

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

  hasOneById(id: EntityType['id']) {
    return this.getOneById(id) !== undefined;
  }

  getOneById(id: EntityType['id']) {
    return this.entries.find((entry) => entry.id === id);
  }

  connectUser(id: EntityType['id']) {
    this.connectedUsers.add(id);
  }

  disconnectUser(id: EntityType['id']) {
    this.connectedUsers.delete(id);
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
  get current() {
    return this.entries[0];
  }

  @computed
  get externals() {
    return this.all.filter((entry) => entry.id !== this.current.id);
  }
}

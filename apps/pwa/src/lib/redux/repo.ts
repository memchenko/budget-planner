import { injectable, inject } from 'inversify';
import type { Store, EntityStateAdapter, CaseReducerActions } from '@reduxjs/toolkit';
import uniqueId from 'lodash/uniqueId';
import { Repo, RepoFilters } from '../../../../../libs/core';
import { getOneByRepoFilters, getManyByRepoFilters } from './selectors';
import { TOKENS } from '../misc/di';

export type Entity = {
  id: string;
  createdAt: number;
  updatedAt: number;
};

export type Actions<E extends Entity> = CaseReducerActions<
  {
    create: EntityStateAdapter<E, string>['addOne'];
    remove: EntityStateAdapter<E, string>['removeOne'];
    removeMany: EntityStateAdapter<E, string>['removeMany'];
    update: EntityStateAdapter<E, string>['updateOne'];
    updateMany: EntityStateAdapter<E, string>['updateMany'];
  },
  string
>;

export type RepoBuilderParams<E extends Entity> = {
  actions: Actions<E>;
  getAll: (store: Store) => E[];
};

export const buildRepo = <E extends Entity = Entity>(params: RepoBuilderParams<E>) => {
  const { actions, getAll } = params;

  @injectable()
  class RepoImpl implements Repo<E> {
    @inject(TOKENS.Store)
    private store!: Store;

    async create(params: Omit<E, 'id'>) {
      const time = Date.now();
      const newEntity = {
        id: uniqueId(),
        ...params,
        createdAt: time,
        updatedAt: time,
      } as E;

      this.store.dispatch(actions.create(newEntity));

      return newEntity;
    }

    async removeOneBy(filters: RepoFilters<E>) {
      const entity = getOneByRepoFilters(getAll(this.store), filters);

      if (!entity) {
        return false;
      }

      this.store.dispatch(actions.remove(entity.id));

      return true;
    }

    async removeMany(filters: RepoFilters<E>) {
      const entities = getManyByRepoFilters(getAll(this.store), filters);

      if (!entities) {
        return false;
      }

      const ids = entities.map(({ id }) => id);
      this.store.dispatch(actions.removeMany(ids));

      return true;
    }

    async getOneBy(filters: RepoFilters<E>) {
      return getOneByRepoFilters(getAll(this.store), filters);
    }

    async getMany(filters: RepoFilters<E>) {
      return getManyByRepoFilters(getAll(this.store), filters) ?? [];
    }

    async getAll() {
      return getAll(this.store);
    }

    async updateOneBy(filters: RepoFilters<E>, values: Partial<Omit<E, 'id'>>) {
      const entity = getOneByRepoFilters(getAll(this.store), filters);

      if (!entity) {
        return null;
      }

      // FIXME: fix types
      const action = actions.update({ id: entity.id, changes: values as any });
      this.store.dispatch(action);

      return {
        ...entity,
        ...values,
      };
    }

    async updateMany(
      data: {
        filters: RepoFilters<E>;
        values: Partial<Omit<E, 'id'>>;
      }[],
    ) {
      const entitiesToUpdate = data.map(({ filters }) => {
        return getOneByRepoFilters(getAll(this.store), filters);
      });

      if (entitiesToUpdate.includes(null)) {
        return null;
      }

      const updates = (entitiesToUpdate as E[]).map(({ id }, index) => {
        return {
          id,
          changes: data[index].values,
        };
      });

      // FIXME: fix types
      this.store.dispatch(actions.updateMany(updates as any));

      return (entitiesToUpdate as E[]).map((entity, index) => ({
        ...entity,
        ...data[index].values,
      }));
    }
  }

  return RepoImpl;
};

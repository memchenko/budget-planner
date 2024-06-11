import { injectable } from 'inversify';
import { Store, EntityStateAdapter, CaseReducerActions } from '@reduxjs/toolkit';
import uniqueId from 'lodash/uniqueId';
import { Repo, RepoFilters } from '../../../../../libs/core';
import { getOneByRepoFilters, getManyByRepoFilters } from './selectors';

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
  store: Store;
  getAll: (store: Store) => E[];
};

export const buildRepo = <E extends Entity = Entity>(params: RepoBuilderParams<E>) => {
  const { actions, store, getAll } = params;

  @injectable()
  class RepoImpl implements Repo<E> {
    async create(params: Omit<E, 'id'>) {
      const time = Date.now();
      const newEntity = {
        id: uniqueId(),
        ...params,
        createdAt: time,
        updatedAt: time,
      } as E;

      store.dispatch(actions.create(newEntity));

      return newEntity;
    }

    async removeOneBy(filters: RepoFilters<E>) {
      const entity = getOneByRepoFilters(getAll(store), filters);

      if (!entity) {
        return false;
      }

      store.dispatch(actions.remove(entity.id));

      return true;
    }

    async removeMany(filters: RepoFilters<E>) {
      const entities = getManyByRepoFilters(getAll(store), filters);

      if (!entities) {
        return false;
      }

      const ids = entities.map(({ id }) => id);
      store.dispatch(actions.removeMany(ids));

      return true;
    }

    async getOneBy(filters: RepoFilters<E>) {
      return getOneByRepoFilters(getAll(store), filters);
    }

    async getMany(filters: RepoFilters<E>) {
      return getManyByRepoFilters(getAll(store), filters) ?? [];
    }

    async getAll() {
      return getAll(store);
    }

    async updateOneBy(filters: RepoFilters<E>, values: Partial<Omit<E, 'id'>>) {
      const entity = getOneByRepoFilters(getAll(store), filters);

      if (!entity) {
        return null;
      }

      // FIXME: fix types
      const action = actions.update({ id: entity.id, changes: values as any });
      store.dispatch(action);

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
        return getOneByRepoFilters(getAll(store), filters);
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
      store.dispatch(actions.updateMany(updates as any));

      return (entitiesToUpdate as E[]).map((entity, index) => ({
        ...entity,
        ...data[index].values,
      }));
    }
  }

  return RepoImpl;
};

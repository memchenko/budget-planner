import type { Store } from '@reduxjs/toolkit';
import { injectable, inject } from 'inversify';
import isNil from 'lodash/isNil';
import { TOKENS } from '../../lib/misc/di';
import { Repo, RepoFilters, entities } from '../../../../../libs/core';
import { actions } from './slice';
import { getAllByCategory } from './selectors';

@injectable()
export class CostTagRepo implements Repo<entities.CostTag> {
  @inject(TOKENS.Store)
  private store!: Store;

  async create(params: entities.CostTag) {
    this.store.dispatch(
      actions.addCategory({
        type: 'cost',
        id: params.costId,
        tagId: params.tagId,
      }),
    );

    return params;
  }

  async removeOneBy(filters: RepoFilters<entities.CostTag>) {
    const matchingTag = await this.getOneBy(filters);

    if (!matchingTag) {
      return false;
    }

    this.store.dispatch(
      actions.removeCategory({
        type: 'cost',
        id: matchingTag.costId,
        tagId: matchingTag.tagId,
      }),
    );

    return true;
  }

  async removeMany(filters: RepoFilters<entities.CostTag>) {
    const matchingTags = await this.getMany(filters);

    if (matchingTags.length === 0) {
      return false;
    }

    this.store.dispatch(
      actions.removeMany({
        type: 'cost',
        id: matchingTags[0].costId,
        tagsIds: matchingTags.map((tag) => tag.tagId),
      }),
    );

    return true;
  }

  async getOneBy(filters: RepoFilters<entities.CostTag>) {
    const tags = getAllByCategory(this.store.getState(), 'cost');
    const matchingTag = tags.find((tag) => {
      const isCostIdEqual = isNil(filters.costId) || tag.costId === filters.costId;
      const isTagIdEqual = isNil(filters.tagId) || tag.tagId === filters.tagId;

      return isCostIdEqual && isTagIdEqual;
    });

    if (!matchingTag) {
      return null;
    }

    return matchingTag;
  }

  async getMany(filters: RepoFilters<entities.CostTag>) {
    const tags = getAllByCategory(this.store.getState(), 'cost');
    const matchingTags = tags.filter((tag) => {
      const isCostIdEqual = isNil(filters.costId) || tag.costId === filters.costId;
      const isTagIdEqual = isNil(filters.tagId) || tag.tagId === filters.tagId;

      return isCostIdEqual && isTagIdEqual;
    });

    return matchingTags;
  }

  async updateOneBy() {
    return null;
  }

  async updateMany() {
    return null;
  }

  async getAll() {
    return getAllByCategory(this.store.getState(), 'cost');
  }
}

@injectable()
export class IncomeTagRepo implements Repo<entities.IncomeTag> {
  @inject(TOKENS.Store)
  private store!: Store;

  async create(params: entities.IncomeTag) {
    this.store.dispatch(
      actions.addCategory({
        type: 'income',
        id: params.incomeId,
        tagId: params.tagId,
      }),
    );

    return params;
  }

  async removeOneBy(filters: RepoFilters<entities.IncomeTag>) {
    const matchingTag = await this.getOneBy(filters);

    if (!matchingTag) {
      return false;
    }

    this.store.dispatch(
      actions.removeCategory({
        type: 'income',
        id: matchingTag.incomeId,
        tagId: matchingTag.tagId,
      }),
    );

    return true;
  }

  async removeMany(filters: RepoFilters<entities.IncomeTag>) {
    const matchingTags = await this.getMany(filters);

    if (matchingTags.length === 0) {
      return false;
    }

    this.store.dispatch(
      actions.removeMany({
        type: 'income',
        id: matchingTags[0].incomeId,
        tagsIds: matchingTags.map((tag) => tag.tagId),
      }),
    );

    return true;
  }

  async getOneBy(filters: RepoFilters<entities.IncomeTag>) {
    const tags = getAllByCategory(this.store.getState(), 'income');
    const matchingTag = tags.find((tag) => {
      const isIncomeIdEqual = isNil(filters.incomeId) || tag.incomeId === filters.incomeId;
      const isTagIdEqual = isNil(filters.tagId) || tag.tagId === filters.tagId;

      return isIncomeIdEqual && isTagIdEqual;
    });

    if (!matchingTag) {
      return null;
    }

    return matchingTag;
  }

  async getMany(filters: RepoFilters<entities.IncomeTag>) {
    const tags = getAllByCategory(this.store.getState(), 'income');
    const matchingTags = tags.filter((tag) => {
      const isIncomeIdEqual = isNil(filters.incomeId) || tag.incomeId === filters.incomeId;
      const isTagIdEqual = isNil(filters.tagId) || tag.tagId === filters.tagId;

      return isIncomeIdEqual && isTagIdEqual;
    });

    return matchingTags;
  }

  async updateOneBy() {
    return null;
  }

  async updateMany() {
    return null;
  }

  async getAll() {
    return getAllByCategory(this.store.getState(), 'income');
  }
}

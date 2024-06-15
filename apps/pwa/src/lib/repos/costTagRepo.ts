import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import isNil from 'lodash/isNil';
import { Repo, RepoFilters, entities } from '../../../../../libs/core';
import { TOKENS } from '../../lib/misc/di';
import { Dictionaries } from '../../entities/dictionaries';

@provide(TOKENS.CostTagRepo)
export class CostTagRepo implements Repo<entities.CostTag> {
  @inject(TOKENS.DictionariesStore)
  private dictionaries!: Dictionaries;

  async create(params: entities.CostTag) {
    this.dictionaries.addCategory({
      type: 'cost',
      id: params.costId,
      tagId: params.tagId,
    });

    return params;
  }

  async removeOneBy(filters: RepoFilters<entities.CostTag>) {
    const matchingTag = await this.getOneBy(filters);

    if (!matchingTag) {
      return false;
    }

    this.dictionaries.removeCategory({
      type: 'cost',
      id: matchingTag.costId,
      tagId: matchingTag.tagId,
    });

    return true;
  }

  async removeMany(filters: RepoFilters<entities.CostTag>) {
    const matchingTags = await this.getMany(filters);

    if (matchingTags.length === 0) {
      return false;
    }

    this.dictionaries.removeMany({
      type: 'cost',
      id: matchingTags[0].costId,
      tagsIds: matchingTags.map((tag) => tag.tagId),
    });

    return true;
  }

  async getOneBy(filters: RepoFilters<entities.CostTag>) {
    const tags = await this.getAll();
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
    const tags = await this.getAll();
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
    return this.dictionaries.getAllByCategory('cost');
  }
}

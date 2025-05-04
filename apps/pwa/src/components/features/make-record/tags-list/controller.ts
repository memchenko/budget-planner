import { makeAutoObservable, action, computed } from 'mobx';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { Tag, EntityType } from '~/stores/tag';
import { User } from '~/stores/user';
import { TOKENS } from '~/shared/constants/di';
import { ScenarioRunner } from '~/shared/impl/scenario-runner';
import { assert } from 'ts-essentials';

@provide(TagsListController)
export class TagsListController {
  type?: 'cost' | 'income';
  onChange?: (selectedTags: EntityType['id'][]) => void;
  selectedTags: EntityType[] = [];
  searchQuery = '';
  parentType?: EntityType['entities'][number]['entity'];
  parentId?: EntityType['entities'][number]['entityId'];

  constructor(
    @inject(TOKENS.TAG_STORE) private readonly tag: Tag,
    @inject(TOKENS.USER_STORE) private readonly user: User,
    @inject(TOKENS.SCENARIO_RUNNER) private readonly scenarioRunner: ScenarioRunner,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get shouldDisplayCreateTagButton() {
    assert(this.type, 'Type of tags is not defined');

    return this.searchQuery.length > 0 && !this.tag.hasTag(this.searchQuery, this.type);
  }

  get recommendedTags() {
    assert(this.type, 'Type of tags is not defined');

    if (!this.parentType || !this.parentId) {
      return [];
    }

    const popularTags = this.tag.getAllByTypeAndParent(this.type, this.parentType, this.parentId);
    let result = popularTags.length > 0 ? popularTags : this.allTags.slice(0, 5);
    result = result.filter((tag) => {
      return !this.selectedTags.some((selectedTag) => selectedTag.id === tag.id);
    });

    return result;
  }

  @computed
  get allTags() {
    assert(this.type, 'Type of tags is not defined');

    const filterBySelectedTags = (tag: EntityType) => {
      return !this.selectedTags.some((selectedTag) => selectedTag.id === tag.id);
    };

    if (this.parentType && this.parentId) {
      return this.tag.getAllByTypeAndParent(this.type, this.parentType, this.parentId).filter(filterBySelectedTags);
    }

    return this.tag.getAllByType(this.type).filter(filterBySelectedTags);
  }

  getTagById(id: EntityType['id']) {
    return this.tag.getOneById(id);
  }

  @action
  handleCreateTagClick() {
    assert(this.type, 'Type of tags is not defined');

    const userId = this.user.current.id;
    const entities: EntityType['entities'] = [];

    if (this.parentType && this.parentId) {
      entities.push({
        entity: this.parentType,
        entityId: this.parentId,
      });
    }

    this.scenarioRunner.execute({
      scenario: 'CreateTag',
      payload: { userId, title: this.searchQuery, type: this.type, entities },
    });
  }

  @action
  handleSearchQueryChange(query: string) {
    this.searchQuery = query;
  }

  @action
  handleTagSelect(tagId: EntityType['id']) {
    const tagEntity = this.getTagById(tagId);
    const isTagSelected = this.selectedTags.some((selectedTag) => selectedTag.id === tagId);

    if (isTagSelected) {
      return;
    }

    if (tagEntity) {
      this.selectedTags = [...this.selectedTags, tagEntity];
      this.onChange?.(this.selectedTags.map(({ id }) => id));
    }
  }

  @action
  handleTagUnselect(tagId: EntityType['id']) {
    this.selectedTags = this.selectedTags.filter((selectedTag) => selectedTag.id !== tagId);
    this.onChange?.(this.selectedTags.map(({ id }) => id));
  }

  @action
  reset() {
    this.selectedTags = [];
  }
}

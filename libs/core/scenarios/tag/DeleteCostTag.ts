import { inject } from 'inversify';
import { assert } from 'ts-essentials';

import { Tag } from '../../entities/Tag';
import { CostTag } from '../../entities/CostTag';
import { TYPES } from '../../types';
import { Repo } from '../../shared/types';
import { BaseScenario } from '../BaseScenario';
import { ScenarioError } from '../../errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '../../shared/constants';

const DELETE_COST_TAGS_ERROR = "Couldn't delete cost tags";
const DELETE_TAG_ERROR = "Couldn't delete a tag";

export interface DeleteCostTagParams {
  tagId: Tag['id'];
}

export class DeleteCostTag extends BaseScenario<DeleteCostTagParams> {
  @inject(TYPES.TagRepo)
  private readonly tagRepo!: Repo<Tag, 'id'>;

  @inject(TYPES.CostTagRepo)
  private readonly costTagRepo!: Repo<CostTag>;

  private initialCostTags: CostTag[] = [];

  async execute() {
    this.initialCostTags = await this.costTagRepo.getMany({ tagId: this.params.tagId });

    const isCostTagsDeleted = await this.costTagRepo.removeMany({ tagId: this.params.tagId });
    assert(isCostTagsDeleted, DELETE_COST_TAGS_ERROR);

    const isTagDeleted = await this.tagRepo.removeOneBy({ id: this.params.tagId });
    assert(isTagDeleted, DELETE_TAG_ERROR);
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    if (this.error.message === DELETE_TAG_ERROR) {
      const costTags = this.initialCostTags.map((costTag) => this.costTagRepo.create(costTag));
      await Promise.all(costTags);
    }
  }
}

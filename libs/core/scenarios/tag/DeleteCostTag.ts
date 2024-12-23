import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Tag } from '#/libs/core/entities/Tag';
import { CostTag } from '#/libs/core/entities/CostTag';
import { TOKENS } from '#/libs/core/types';
import { Repo } from '#/libs/core/shared/types';
import { BaseScenario } from '#/libs/core/scenarios/BaseScenario';
import { ScenarioError } from '#/libs/core/errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '#/libs/core/shared/constants';

const DELETE_COST_TAGS_ERROR = "Couldn't delete cost tags";
const DELETE_TAG_ERROR = "Couldn't delete a tag";

export interface DeleteCostTagParams {
  tagId: Tag['id'];
}

@injectable()
export class DeleteCostTag extends BaseScenario<DeleteCostTagParams> {
  constructor(
    @inject(TOKENS.TAG_REPO)
    private tagRepo: Repo<Tag, 'id'>,
    @inject(TOKENS.COST_TAG_REPO)
    private costTagRepo: Repo<CostTag>,
  ) {
    super();
  }

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

import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Tag } from '#/libs/core/entities/Tag';
import { IncomeTag } from '#/libs/core/entities/IncomeTag';
import { TOKENS } from '#/libs/core/types';
import { Repo } from '#/libs/core/shared/types';
import { BaseScenario } from '#/libs/core/scenarios/BaseScenario';
import { ScenarioError } from '#/libs/core/errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '#/libs/core/shared/constants';

const DELETE_INCOME_TAGS_ERROR = "Couldn't delete income tags";
const DELETE_TAG_ERROR = "Couldn't delete a tag";

export interface DeleteIncomeTagParams {
  tagId: Tag['id'];
}

@injectable()
export class DeleteIncomeTag extends BaseScenario<DeleteIncomeTagParams> {
  constructor(
    @inject(TOKENS.TagRepo)
    private tagRepo: Repo<Tag, 'id'>,
    @inject(TOKENS.IncomeTagRepo)
    private incomeTagRepo: Repo<IncomeTag>,
  ) {
    super();
  }

  private initialIncomeTags: IncomeTag[] = [];

  async execute() {
    this.initialIncomeTags = await this.incomeTagRepo.getMany({ tagId: this.params.tagId });

    const isIncomeTagsDeleted = await this.incomeTagRepo.removeMany({ tagId: this.params.tagId });
    assert(isIncomeTagsDeleted, DELETE_INCOME_TAGS_ERROR);

    const isTagDeleted = await this.tagRepo.removeOneBy({ id: this.params.tagId });
    assert(isTagDeleted, DELETE_TAG_ERROR);
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    if (this.error.message === DELETE_TAG_ERROR) {
      const incomeTags = this.initialIncomeTags.map((incomeTag) => this.incomeTagRepo.create(incomeTag));
      await Promise.all(incomeTags);
    }
  }
}

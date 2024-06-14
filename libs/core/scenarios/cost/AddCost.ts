import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from '../../shared/types';
import { Cost } from '../../entities/Cost';
import { Fund } from '../../entities/Fund';
import { Tag } from '../../entities/Tag';
import { CostTag } from '../../entities/CostTag';
import { TOKENS } from '../../types';
import { BaseScenario } from '../BaseScenario';
import { ScenarioError } from '../../errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '../../shared/constants';
import { assertEntity } from '../../shared/assertions';
import { ENTITY_NAME } from '../../shared/constants';

const CREATE_COST_TAG_ERROR = "Couldn't create some cost tags";

export type AddCostParams = Parameters<Repo<Cost, 'id'>['create']>[0] & {
  tagsIds: Tag['id'][];
};

@injectable()
export class AddCost extends BaseScenario<AddCostParams> {
  static TOKEN = Symbol.for('AddCost');

  @inject(TOKENS.CostRepo)
  private readonly costRepo!: Repo<Cost, 'id'>;

  @inject(TOKENS.FundRepo)
  private readonly fundRepo!: Repo<Fund, 'id'>;

  @inject(TOKENS.CostTagRepo)
  private readonly costTagRepo!: Repo<CostTag>;

  private cost: Cost | null = null;
  private fund: Fund | null = null;
  private costTags: CostTag[] = [];
  private initialBalance: number | null = null;

  async execute() {
    this.cost = await this.costRepo.create(this.params);
    assertEntity(this.cost, ENTITY_NAME.COST);

    await this.assignTags(this.cost);
    assert(this.costTags.length === this.params.tagsIds.length, CREATE_COST_TAG_ERROR);

    await this.subtractCostFromFund(this.cost);
    assertEntity(this.fund, ENTITY_NAME.FUND);
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    const isErrorUpdatingBalance = this.error.message.includes(ENTITY_NAME.FUND) && this.initialBalance !== null;

    if (isErrorUpdatingBalance) {
      await this.fundRepo.updateOneBy({ id: this.params.fundId }, { balance: this.initialBalance! });
    }

    await this.costTagRepo.removeMany({ costId: this.cost?.id });
    await this.costRepo.removeOneBy({ id: this.cost?.id });
  }

  private async assignTags(cost: Cost) {
    const costTags = this.params.tagsIds.map((tagId) => {
      return this.costTagRepo.create({ tagId, costId: cost.id });
    });

    this.costTags = (await Promise.all(costTags)).filter((value): value is CostTag => value !== null);
  }

  private async subtractCostFromFund(cost: Cost) {
    this.fund = await this.fundRepo.getOneBy({ id: this.params.fundId });
    assertEntity(this.fund, ENTITY_NAME.FUND);

    this.initialBalance = this.fund.balance;
    this.fund = await this.fundRepo.updateOneBy(
      { id: this.params.fundId },
      {
        balance: this.fund.balance - cost.amount,
      },
    );
  }
}

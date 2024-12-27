import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from '#/libs/core/shared/types';
import { Cost } from '#/libs/core/entities/Cost';
import { Fund } from '#/libs/core/entities/Fund';
import { Wallet } from '#/libs/core/entities/Wallet';
import { Tag } from '#/libs/core/entities/Tag';
import { CostTag } from '#/libs/core/entities/CostTag';
import { TOKENS } from '#/libs/core/types';
import { BaseScenario } from '#/libs/core/scenarios/BaseScenario';
import { ScenarioError } from '#/libs/core/errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '#/libs/core/shared/constants';
import { assertEntity } from '#/libs/core/shared/assertions';
import { ENTITY_NAME } from '#/libs/core/shared/constants';
import { fund, wallet } from '#/libs/core/shared/schemas';

const CREATE_COST_TAG_ERROR = "Couldn't create some cost tags";

export type AddCostParams = Parameters<Repo<Cost, 'id'>['create']>[0] & {
  tagsIds: Tag['id'][];
};

@injectable()
export class AddCost extends BaseScenario<AddCostParams> {
  static TOKEN = Symbol.for('AddCost');

  constructor(
    @inject(TOKENS.COST_REPO)
    private costRepo: Repo<Cost, 'id'>,
    @inject(TOKENS.FUND_REPO)
    private fundRepo: Repo<Fund, 'id'>,
    @inject(TOKENS.WALLET_REPO)
    private walletRepo: Repo<Wallet, 'id'>,
    @inject(TOKENS.COST_TAG_REPO)
    private costTagRepo: Repo<CostTag>,
  ) {
    super();
  }

  private cost: Cost | null = null;
  private fund: Fund | null = null;
  private wallet: Wallet | null = null;
  private costTags: CostTag[] = [];
  private initialBalance: number | null = null;

  async execute() {
    this.cost = await this.costRepo.create(this.params);
    assertEntity(this.cost, ENTITY_NAME.COST);

    await this.assignTags(this.cost);
    assert(this.costTags.length === this.params.tagsIds.length, CREATE_COST_TAG_ERROR);

    await this.subtractCost(this.cost);

    if (this.params.entity === fund) {
      assertEntity(this.fund, ENTITY_NAME.FUND);
    } else if (this.params.entity === wallet) {
      assertEntity(this.wallet, ENTITY_NAME.WALLET);
    }
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    const isErrorUpdatingBalance =
      (this.error.message.includes(ENTITY_NAME.FUND) || this.error.message.includes(ENTITY_NAME.WALLET)) &&
      this.initialBalance !== null;

    if (isErrorUpdatingBalance) {
      if (this.params.entity === fund) {
        await this.fundRepo.updateOneBy({ id: this.params.entityId }, { balance: this.initialBalance! });
      } else if (this.params.entity === wallet) {
        await this.walletRepo.updateOneBy({ id: this.params.entityId }, { balance: this.initialBalance! });
      }
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

  private async subtractCost(cost: Cost) {
    if (this.params.entity === fund) {
      this.fund = await this.fundRepo.getOneBy({ id: this.params.entityId });
      assertEntity(this.fund, ENTITY_NAME.FUND);

      this.initialBalance = this.fund.balance;
      this.fund = await this.fundRepo.updateOneBy(
        { id: this.params.entityId },
        {
          balance: this.fund.balance - cost.amount,
        },
      );
    } else if (this.params.entity === wallet) {
      this.wallet = await this.walletRepo.getOneBy({ id: this.params.entityId });
      assertEntity(this.wallet, ENTITY_NAME.WALLET);

      this.initialBalance = this.wallet.balance;
      this.wallet = await this.walletRepo.updateOneBy(
        { id: this.params.entityId },
        {
          balance: this.wallet.balance - cost.amount,
        },
      );
    }
  }
}

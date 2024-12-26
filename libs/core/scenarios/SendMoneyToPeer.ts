import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from '#/libs/core/shared/types';
import { fund, wallet } from '#/libs/core/shared/schemas';
import { Fund } from '#/libs/core/entities/Fund';
import { Wallet } from '#/libs/core/entities/Wallet';
import { Cost } from '#/libs/core/entities/Cost';
import { Income } from '#/libs/core/entities/Income';
import { User } from '#/libs/core/entities/User';
import { SynchronizationOrder } from '#/libs/core/entities/SynchronizationOrder';
import { TOKENS } from '#/libs/core/types';
import { BaseScenario } from '#/libs/core/scenarios/BaseScenario';
import { ScenarioError } from '#/libs/core/errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '#/libs/core/shared/constants';
import { assertEntity } from '#/libs/core/shared/assertions';
import { ENTITY_NAME } from '#/libs/core/shared/constants';
import { income } from '#/libs/core/shared/schemas';

export type SendMoneyToPeerParams = {
  fromUserId: User['id'];
  toUserId: User['id'];
  amount: number;
} & (
  | {
      walletId: Wallet['id'];
    }
  | {
      fundId: Fund['id'];
    }
);

@injectable()
export class SendMoneyToPeer extends BaseScenario<SendMoneyToPeerParams> {
  constructor(
    @inject(TOKENS.SYNCHRONIZATION_ORDER)
    private readonly synchronizationOrdersRepo: Repo<SynchronizationOrder, 'id'>,
    @inject(TOKENS.INCOME_REPO)
    private readonly incomeRepo: Repo<Income, 'id'>,
    @inject(TOKENS.COST_REPO)
    private readonly costRepo: Repo<Cost, 'id'>,
  ) {
    super();
  }

  private income: Income | null = null;
  private cost: Cost | null = null;
  private order: SynchronizationOrder | null = null;

  async execute() {
    const date = Date.now();
    this.income = await this.incomeRepo.create({
      userId: this.params.toUserId,
      amount: this.params.amount,
      date,
      note: `From user with id: ${this.params.fromUserId}`,
    });

    assertEntity(this.income, ENTITY_NAME.INCOME);

    const partialCostParams: Omit<Parameters<typeof this.costRepo.create>[0], 'entity' | 'entityId'> = {
      userId: this.params.fromUserId,
      amount: this.params.amount,
      date,
      note: `To user with id: ${this.params.toUserId}`,
    };

    if ('fundId' in this.params) {
      this.cost = await this.costRepo.create({
        ...partialCostParams,
        entity: fund,
        entityId: this.params.fundId,
      });
    } else if ('walletId' in this.params) {
      this.cost = await this.costRepo.create({
        ...partialCostParams,
        entity: wallet,
        entityId: this.params.walletId,
      });
    }

    assertEntity(this.cost, ENTITY_NAME.COST);

    this.order = await this.synchronizationOrdersRepo.create({
      userId: this.params.toUserId,
      entity: income,
      entityId: this.income.id,
      action: 'create',
    });

    assertEntity(this.order, ENTITY_NAME.SYNCHRONIZATION_ORDER);
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    if (this.error.message.includes(ENTITY_NAME.SYNCHRONIZATION_ORDER)) {
      assertEntity(this.cost, ENTITY_NAME.COST);

      await this.costRepo.removeOneBy({ id: this.cost.id });
    }

    if (this.error.message.includes(ENTITY_NAME.COST)) {
      assertEntity(this.income, ENTITY_NAME.INCOME);

      await this.incomeRepo.removeOneBy({ id: this.income.id });
    }
  }
}

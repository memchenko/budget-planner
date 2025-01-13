import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from 'core/shared/types';
import { Cost } from 'core/entities/Cost';
import { Fund } from 'core/entities/Fund';
import { Wallet } from 'core/entities/Wallet';
import { TOKENS } from 'core/types';
import { BaseScenario } from 'core/scenarios/BaseScenario';
import { ScenarioError } from 'core/errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT, ENTITY_NAME } from 'core/shared/constants';
import { assertEntity } from 'core/shared/assertions';
import { fund, wallet, cost } from 'core/shared/schemas';
import { SharingRule } from 'core/entities/SharingRule';
import { SynchronizationOrder } from 'core/entities/SynchronizationOrder';

export type AddCostParams = Parameters<Repo<Cost, 'id'>['create']>[0];

@injectable()
export class AddCost extends BaseScenario<AddCostParams> {
  static TOKEN = Symbol.for('AddCost');

  constructor(
    @inject(TOKENS.SHARING_RULE_REPO) private readonly sharingRuleRepo: Repo<SharingRule, 'id'>,
    @inject(TOKENS.SYNCHRONIZATION_ORDER_REPO)
    private readonly synchronizationOrderRepo: Repo<SynchronizationOrder, 'id'>,
    @inject(TOKENS.COST_REPO) private readonly costRepo: Repo<Cost, 'id'>,
    @inject(TOKENS.FUND_REPO) private readonly fundRepo: Repo<Fund, 'id'>,
    @inject(TOKENS.WALLET_REPO) private readonly walletRepo: Repo<Wallet, 'id'>,
  ) {
    super();
  }

  private cost: Cost | null = null;
  private fund: Fund | null = null;
  private wallet: Wallet | null = null;
  private initialBalance: number | null = null;

  async execute() {
    this.cost = await this.costRepo.create(this.params);
    assertEntity(this.cost, ENTITY_NAME.COST);

    await this.subtractCost(this.cost);

    if (this.params.entity === fund) {
      assertEntity(this.fund, ENTITY_NAME.FUND);
    } else if (this.params.entity === wallet) {
      assertEntity(this.wallet, ENTITY_NAME.WALLET);
    }

    const sharingRule = await this.sharingRuleRepo.getOneBy({
      entity: this.params.entity,
      entityId: this.params.entityId,
    });

    if (sharingRule !== null) {
      this.synchronizationOrderRepo.create({
        userId: this.params.userId,
        entity: cost,
        entityId: this.cost.id,
        action: 'create',
      });
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

    await this.costRepo.removeOneBy({ id: this.cost?.id });
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

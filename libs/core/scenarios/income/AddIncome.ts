import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from 'core/shared/types';
import { Income } from 'core/entities/Income';
import { Wallet } from 'core/entities/Wallet';
import { SharingRule } from 'core/entities/SharingRule';
import { SynchronizationOrder } from 'core/entities/SynchronizationOrder';
import { TOKENS } from 'core/types';
import { BaseScenario } from 'core/scenarios/BaseScenario';
import { ScenarioError } from 'core/errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT, ENTITY_NAME } from 'core/shared/constants';
import { assertEntity } from 'core/shared/assertions';
import { income } from 'core/shared/schemas';

export type AddIncomeParams = Parameters<Repo<Income, 'id'>['create']>[0];

@injectable()
export class AddIncome extends BaseScenario<AddIncomeParams> {
  constructor(
    @inject(TOKENS.INCOME_REPO) private readonly incomeRepo: Repo<Income, 'id'>,
    @inject(TOKENS.SHARING_RULE_REPO) private readonly sharingRuleRepo: Repo<SharingRule, 'id'>,
    @inject(TOKENS.SYNCHRONIZATION_ORDER_REPO)
    private readonly synchronizationOrderRepo: Repo<SynchronizationOrder, 'id'>,
    @inject(TOKENS.WALLET_REPO) private readonly walletRepo: Repo<Wallet, 'id'>,
  ) {
    super();
  }

  private income: Income | null = null;
  private wallet: Wallet | null = null;
  private initialBalance: number | null = null;

  async execute() {
    this.income = await this.incomeRepo.create(this.params);
    assertEntity(this.income, ENTITY_NAME.INCOME);

    await this.addIncomeToWallet(this.income);
    assertEntity(this.wallet, ENTITY_NAME.WALLET);

    const sharingRule = await this.sharingRuleRepo.getOneBy({
      entity: this.params.entity,
      entityId: this.params.entityId,
    });

    if (sharingRule !== null) {
      await this.synchronizationOrderRepo.create({
        userId: this.params.userId,
        entity: income,
        entityId: this.income.id,
        action: 'create',
      });
    }
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    const isErrorUpdatingBalance = this.error.message.includes(ENTITY_NAME.FUND) && this.initialBalance !== null;

    if (isErrorUpdatingBalance) {
      await this.walletRepo.updateOneBy({ userId: this.params.userId }, { balance: this.initialBalance! });
    }

    await this.incomeRepo.removeOneBy({ id: this.income?.id });
  }

  private async addIncomeToWallet(income: Income) {
    this.wallet = await this.walletRepo.getOneBy({ userId: this.params.userId });
    assertEntity(this.wallet, ENTITY_NAME.WALLET);

    this.initialBalance = this.wallet.balance;
    this.wallet = await this.walletRepo.updateOneBy(
      { userId: this.params.userId },
      {
        balance: this.wallet.balance + income.amount,
      },
    );
  }
}

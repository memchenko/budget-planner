import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from '#/libs/core/shared/types';
import { Income } from '#/libs/core/entities/Income';
import { Tag } from '#/libs/core/entities/Tag';
import { Wallet } from '#/libs/core/entities/Wallet';
import { IncomeTag } from '#/libs/core/entities/IncomeTag';
import { TOKENS } from '#/libs/core/types';
import { BaseScenario } from '#/libs/core/scenarios/BaseScenario';
import { ScenarioError } from '#/libs/core/errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '#/libs/core/shared/constants';
import { assertEntity } from '#/libs/core/shared/assertions';
import { ENTITY_NAME } from '#/libs/core/shared/constants';

const CREATE_INCOME_TAG_ERROR = "Couldn't create some income tags";

export type AddIncomeParams = Parameters<Repo<Income, 'id'>['create']>[0] & {
  tagsIds: Tag['id'][];
};

@injectable()
export class AddIncome extends BaseScenario<AddIncomeParams> {
  constructor(
    @inject(TOKENS.INCOME_REPO)
    private incomeRepo: Repo<Income, 'id'>,
    @inject(TOKENS.WalletRepo)
    private walletRepo: Repo<Wallet, 'id'>,
    @inject(TOKENS.INCOME_TAG_REPO)
    private incomeTagRepo: Repo<IncomeTag>,
  ) {
    super();
  }

  private income: Income | null = null;
  private wallet: Wallet | null = null;
  private incomeTags: IncomeTag[] = [];
  private initialBalance: number | null = null;

  async execute() {
    this.income = await this.incomeRepo.create(this.params);
    assertEntity(this.income, ENTITY_NAME.INCOME);

    await this.assignTags(this.income);
    assert(this.incomeTags.length === this.params.tagsIds.length, CREATE_INCOME_TAG_ERROR);

    await this.addIncomeToWallet(this.income);
    assertEntity(this.wallet, ENTITY_NAME.WALLET);
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    const isErrorUpdatingBalance = this.error.message.includes(ENTITY_NAME.FUND) && this.initialBalance !== null;

    if (isErrorUpdatingBalance) {
      await this.walletRepo.updateOneBy({ userId: this.params.userId }, { balance: this.initialBalance! });
    }

    await this.incomeTagRepo.removeMany({ incomeId: this.income?.id });
    await this.incomeRepo.removeOneBy({ id: this.income?.id });
  }

  private async assignTags(income: Income) {
    const incomeTags = this.params.tagsIds.map((tagId) => {
      return this.incomeTagRepo.create({ tagId, incomeId: income.id });
    });

    this.incomeTags = (await Promise.all(incomeTags)).filter((value): value is IncomeTag => value !== null);
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

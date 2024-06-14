import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from '../../shared/types';
import { Income } from '../../entities/Income';
import { Fund } from '../../entities/Fund';
import { Tag } from '../../entities/Tag';
import { IncomeTag } from '../../entities/IncomeTag';
import { TOKENS } from '../../types';
import { BaseScenario } from '../BaseScenario';
import { ScenarioError } from '../../errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '../../shared/constants';
import { assertEntity } from '../../shared/assertions';
import { ENTITY_NAME } from '../../shared/constants';

const CREATE_INCOME_TAG_ERROR = "Couldn't create some income tags";

export type AddIncomeParams = Parameters<Repo<Income, 'id'>['create']>[0] & {
  tagsIds: Tag['id'][];
};

@injectable()
export class AddIncome extends BaseScenario<AddIncomeParams> {
  @inject(TOKENS.IncomeRepo)
  private readonly incomeRepo!: Repo<Income, 'id'>;

  @inject(TOKENS.FundRepo)
  private readonly fundRepo!: Repo<Fund, 'id'>;

  @inject(TOKENS.IncomeTagRepo)
  private readonly incomeTagRepo!: Repo<IncomeTag>;

  private income: Income | null = null;
  private fund: Fund | null = null;
  private incomeTags: IncomeTag[] = [];
  private initialBalance: number | null = null;

  async execute() {
    this.income = await this.incomeRepo.create(this.params);
    assertEntity(this.income, ENTITY_NAME.INCOME);

    await this.assignTags(this.income);
    assert(this.incomeTags.length === this.params.tagsIds.length, CREATE_INCOME_TAG_ERROR);

    await this.addIncomeToFund(this.income);
    assertEntity(this.fund, ENTITY_NAME.FUND);
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    const isErrorUpdatingBalance = this.error.message.includes(ENTITY_NAME.FUND) && this.initialBalance !== null;

    if (isErrorUpdatingBalance) {
      await this.fundRepo.updateOneBy({ userId: this.params.userId, isMain: true }, { balance: this.initialBalance! });
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

  private async addIncomeToFund(income: Income) {
    this.fund = await this.fundRepo.getOneBy({ userId: this.params.userId, isMain: true });
    assertEntity(this.fund, ENTITY_NAME.FUND);

    this.initialBalance = this.fund.balance;
    this.fund = await this.fundRepo.updateOneBy(
      { userId: this.params.userId, isMain: true },
      {
        balance: this.fund.balance + income.amount,
      },
    );
  }
}

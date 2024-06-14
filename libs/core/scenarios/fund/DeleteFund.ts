import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from '../../shared/types';
import { Fund } from '../../entities/Fund';
import { User } from '../../entities/User';
import { TOKENS } from '../../types';
import { BaseScenario } from '../BaseScenario';
import { ScenarioError } from '../../errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '../../shared/constants';
import { assertEntity } from '../../shared/assertions';
import { ENTITY_NAME } from '../../shared/constants';

const UPDATE_MAIN_FUND_ERROR = "Coudn't update main fund";
const DELETE_FUND_ERROR = "Couldn't delete fund";

export interface DeleteFundParams {
  userId: User['id'];
  fundId: Fund['id'];
}

@injectable()
export class DeleteFund extends BaseScenario<DeleteFundParams> {
  static TOKEN = Symbol.for('DeleteFund');

  @inject(TOKENS.FundRepo)
  private readonly fundRepo!: Repo<Fund, 'id'>;

  private initialMainFundBalance: number | null = null;

  async execute() {
    const mainFund = await this.fundRepo.getOneBy({ userId: this.params.userId, isMain: true });
    const fundToDelete = await this.fundRepo.getOneBy({ id: this.params.fundId });
    assertEntity(mainFund, ENTITY_NAME.FUND);
    assertEntity(fundToDelete, ENTITY_NAME.FUND);

    this.initialMainFundBalance = mainFund.balance;
    const newMainFundBalance = mainFund.balance + fundToDelete.balance;

    const updatedMainFund = await this.fundRepo.updateOneBy({ id: mainFund.id }, { balance: newMainFundBalance });
    assert(updatedMainFund !== null, UPDATE_MAIN_FUND_ERROR);

    const isFundDeleted = await this.fundRepo.removeOneBy({ id: this.params.fundId });
    assert(isFundDeleted, DELETE_FUND_ERROR);
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    const isErrorDeletingFund = this.error.message.includes(DELETE_FUND_ERROR);

    if (isErrorDeletingFund) {
      await this.fundRepo.updateOneBy(
        { userId: this.params.userId, isMain: true },
        { balance: this.initialMainFundBalance! },
      );
    }
  }
}

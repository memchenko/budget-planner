import { inject } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from '../../shared/types';
import { Fund } from '../../entities/Fund';
import { User } from '../../entities/User';
import { TYPES } from '../../types';
import { BaseScenario } from '../BaseScenario';
import { ScenarioError } from '../../errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '../../shared/constants';
import { assertEntity } from '../../shared/assertions';
import { ENTITY_NAME } from '../../shared/constants';

const UPDATE_FUNDS_ERROR = "Couldn't update funds balances";
const UPDATE_MAIN_FUND_ERROR = "Coudn't update main fund";

export interface DistributeBalanceParams {
  userId: User['id'];
}

export class DistributeBalance extends BaseScenario<DistributeBalanceParams> {
  @inject(TYPES.FundRepo)
  private readonly fundRepo!: Repo<Fund, 'id'>;

  private initialFundsBalances: Record<Fund['id'], number> = {};

  async execute() {
    const mainFund = await this.fundRepo.getOneBy({ userId: this.params.userId, isMain: true });
    const otherFunds = await this.fundRepo.getMany({ userId: this.params.userId, isMain: false });
    assertEntity(mainFund, ENTITY_NAME.FUND);

    let remainder = (this.initialFundsBalances[mainFund.id] = mainFund.balance);
    otherFunds.forEach((fund) => {
      this.initialFundsBalances[fund.id] = fund.balance;
    });

    otherFunds.sort((a, b) => a.priority - b.priority);

    const newFunds = [];

    while (remainder > 0 && otherFunds.length > 0) {
      const fund = otherFunds.shift();
      assert(fund !== undefined, 'Some funds are undefined');

      newFunds.push(fund);

      let addition!: number;
      if (fund.balance >= 0 && !fund.isCumulative) {
        addition = Math.min(remainder, fund.capacity - fund.balance);
        remainder += fund.balance;
      } else if (fund.balance < 0 && fund.isEager) {
        addition = Math.min(remainder, Math.abs(fund.balance) + fund.capacity);
      } else {
        addition = Math.min(remainder, fund.capacity);
      }

      fund.balance += addition;
      remainder -= addition;
    }

    const updatedFunds = await this.fundRepo.updateMany(
      newFunds.map(({ id, ...patch }) => ({
        filters: { id },
        values: patch,
      })),
    );
    assert(updatedFunds, UPDATE_FUNDS_ERROR);

    const updatedMainFund = await this.fundRepo.updateOneBy(
      { userId: this.params.userId, isMain: true },
      { balance: Math.max(remainder, 0) },
    );
    assert(updatedMainFund, UPDATE_MAIN_FUND_ERROR);
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    const isErrorUpdatingMainBalance = this.error.message.includes(UPDATE_MAIN_FUND_ERROR);

    if (isErrorUpdatingMainBalance) {
      const fundsUpdates = Object.entries(this.initialFundsBalances).map(
        ([fundId, initialBalance]) =>
          ({
            filters: { id: fundId },
            values: { balance: initialBalance },
          }) as const,
      );
      await this.fundRepo.updateMany(fundsUpdates);
    }
  }
}

import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from '#/libs/core/shared/types';
import { Fund } from '#/libs/core/entities/Fund';
import { Wallet } from '#/libs/core/entities/Wallet';
import { User } from '#/libs/core/entities/User';
import { TOKENS } from '#/libs/core/types';
import { BaseScenario } from '#/libs/core/scenarios/BaseScenario';
import { ScenarioError } from '#/libs/core/errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '#/libs/core/shared/constants';
import { assertEntity } from '#/libs/core/shared/assertions';
import { ENTITY_NAME } from '#/libs/core/shared/constants';

const UPDATE_FUNDS_ERROR = "Couldn't update funds balances";
const UPDATE_WALLET_ERROR = "Coudn't update wallet";

export interface DistributeBalanceParams {
  userId: User['id'];
}

@injectable()
export class DistributeBalance extends BaseScenario<DistributeBalanceParams> {
  constructor(
    @inject(TOKENS.FUND_REPO)
    private fundRepo: Repo<Fund, 'id'>,
    @inject(TOKENS.WalletRepo)
    private walletRepo: Repo<Wallet, 'id'>,
  ) {
    super();
  }

  private initialWalletBalance!: number;
  private initialFundsBalances: Record<Fund['id'], number> = {};

  async execute() {
    const wallet = await this.fundRepo.getOneBy({ userId: this.params.userId });
    const funds = await this.fundRepo.getMany({ userId: this.params.userId });
    assertEntity(wallet, ENTITY_NAME.WALLET);

    let remainder = (this.initialWalletBalance = wallet.balance);
    funds.forEach((fund) => {
      this.initialFundsBalances[fund.id] = fund.balance;
    });

    funds.sort((a, b) => a.priority - b.priority);

    const newFunds = [];

    while (remainder > 0 && funds.length > 0) {
      const fund = funds.shift();
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

    const updatedWallet = await this.walletRepo.updateOneBy(
      { userId: this.params.userId },
      { balance: Math.max(remainder, 0) },
    );
    assert(updatedWallet, UPDATE_WALLET_ERROR);
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    const isErrorUpdatingWalletBalance = this.error.message.includes(UPDATE_WALLET_ERROR);

    if (isErrorUpdatingWalletBalance) {
      const fundsUpdates = Object.entries(this.initialFundsBalances).map(
        ([fundId, initialBalance]) =>
          ({
            filters: { id: fundId },
            values: { balance: initialBalance },
          }) as const,
      );
      await this.walletRepo.updateOneBy({ userId: this.params.userId }, { balance: this.initialWalletBalance });
      await this.fundRepo.updateMany(fundsUpdates);
    }
  }
}

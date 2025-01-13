import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';
import { Repo } from 'core/shared/types';
import { Fund } from 'core/entities/Fund';
import { User } from 'core/entities/User';
import { TOKENS } from 'core/types';
import { BaseScenario } from 'core/scenarios/BaseScenario';
import { ScenarioError } from 'core/errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from 'core/shared/constants';
import { assertEntity } from 'core/shared/assertions';
import { ENTITY_NAME } from 'core/shared/constants';
import { Wallet } from 'core/entities/Wallet';

const UPDATE_WALLET_ERROR = "Coudn't update wallet";
const DELETE_FUND_ERROR = "Couldn't delete fund";

export interface DeleteFundParams {
  userId: User['id'];
  fundId: Fund['id'];
}

@injectable()
export class DeleteFund extends BaseScenario<DeleteFundParams> {
  static TOKEN = Symbol.for('DeleteFund');

  constructor(
    @inject(TOKENS.FUND_REPO)
    private fundRepo: Repo<Fund, 'id'>,
    @inject(TOKENS.WALLET_REPO)
    private walletRepo: Repo<Wallet, 'id'>,
  ) {
    super();
  }

  private initialWalletBalance: number | null = null;

  async execute() {
    const wallet = await this.walletRepo.getOneBy({ userId: this.params.userId });
    const fundToDelete = await this.fundRepo.getOneBy({ id: this.params.fundId });
    assertEntity(wallet, ENTITY_NAME.WALLET);
    assertEntity(fundToDelete, ENTITY_NAME.FUND);

    this.initialWalletBalance = wallet.balance;
    const newWalletBalance = wallet.balance + fundToDelete.balance;

    const updatedWallet = await this.walletRepo.updateOneBy({ id: wallet.id }, { balance: newWalletBalance });
    assert(updatedWallet !== null, UPDATE_WALLET_ERROR);

    const isFundDeleted = await this.fundRepo.removeOneBy({ id: this.params.fundId });
    assert(isFundDeleted, DELETE_FUND_ERROR);
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    const isErrorDeletingFund = this.error.message.includes(DELETE_FUND_ERROR);

    if (isErrorDeletingFund) {
      await this.fundRepo.updateOneBy({ userId: this.params.userId }, { balance: this.initialWalletBalance! });
    }
  }
}

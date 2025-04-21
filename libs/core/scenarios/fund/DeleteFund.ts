import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';
import { Repo } from 'core/shared/types';
import { Fund } from 'core/entities/Fund';
import { User } from 'core/entities/User';
import { SharingRule } from 'core/entities/SharingRule';
import { TOKENS } from 'core/types';
import { BaseScenario } from 'core/scenarios/BaseScenario';
import { AddSynchronizationOrder } from 'core/scenarios/AddSynchronizationOrder';
import { ScenarioError } from 'core/errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from 'core/shared/constants';
import { assertEntity } from 'core/shared/assertions';
import { ENTITY_NAME } from 'core/shared/constants';
import { Wallet } from 'core/entities/Wallet';
import { fund } from 'core/shared/schemas';

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
    @inject(TOKENS.FUND_REPO) private readonly fundRepo: Repo<Fund, 'id'>,
    @inject(TOKENS.WALLET_REPO) private readonly walletRepo: Repo<Wallet, 'id'>,
    @inject(TOKENS.SHARING_RULE_REPO) private readonly sharingRuleRepo: Repo<SharingRule, 'id'>,
    @inject(AddSynchronizationOrder) private readonly addSynchronizationOrderScenario: AddSynchronizationOrder,
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

    const fundSharingRule = await this.sharingRuleRepo.getOneBy({
      entity: fund,
      entityId: fundToDelete.id,
    });

    if (fundSharingRule !== null) {
      if (fundSharingRule.ownerId === this.params.userId) {
        await this.addSynchronizationOrderScenario.run({
          entity: fund,
          entityId: fundToDelete.id,
          action: 'delete',
          userId: fundSharingRule.userId,
        });
      }
    }
  }

  async revert() {
    assert(this.error instanceof ScenarioError, UNKNOWN_ERROR_TEXT);

    const isErrorDeletingFund = this.error.message.includes(DELETE_FUND_ERROR);

    if (isErrorDeletingFund) {
      await this.fundRepo.updateOneBy({ userId: this.params.userId }, { balance: this.initialWalletBalance! });
    }
  }
}

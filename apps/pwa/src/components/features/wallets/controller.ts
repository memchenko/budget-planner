import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { observable, computed, action, makeAutoObservable } from 'mobx';
import { Wallet } from '~/entities/wallet';
import { TOKENS } from '~/shared/constants/di';
import { ScenarioRunner } from '~/shared/impl/scenario-runner';
import { asMoney } from '#/libs/formatting/money';
import { assert } from 'ts-essentials';

@provide(WalletController)
export class WalletController {
  constructor(
    @inject(TOKENS.WALLETS_STORE)
    private wallets: Wallet,
    @inject(TOKENS.SCENARIO_RUNNER)
    private scenario: ScenarioRunner,
  ) {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      },
    );
  }

  @observable newBalance: string | null = null;
  @observable newTitle: string | null = null;

  @computed get wallet() {
    return this.wallets.all?.[0];
  }

  @computed get balance() {
    return this.wallet?.balance;
  }

  @computed get formattedBalance() {
    return asMoney(this.balance ?? 0);
  }

  @computed get title() {
    return this.wallet?.title ?? 'my wallet';
  }

  @computed get isBalanceChangeMode() {
    return this.newBalance !== null;
  }

  @computed get isTitleChangeMode() {
    return this.newTitle !== null;
  }

  @computed get isEditing() {
    return this.isBalanceChangeMode || this.isTitleChangeMode;
  }

  @computed get inputValue() {
    if (this.isBalanceChangeMode) {
      return String(this.newBalance ?? this.balance);
    } else {
      return this.newTitle ?? this.title;
    }
  }

  @action
  handleInputChange(value: string) {
    if (this.isBalanceChangeMode) {
      this.newBalance = value;
    } else {
      this.newTitle = value;
    }
  }

  @action
  handleLeftButtonClick() {
    if (!this.isBalanceChangeMode && !this.isTitleChangeMode) {
      this.startChangingTitle();
    } else if (this.isBalanceChangeMode || this.isTitleChangeMode) {
      this.cancel();
    }
  }

  @action
  handleRightButtonClick() {
    if (!this.isBalanceChangeMode && !this.isTitleChangeMode) {
      this.startEditingBalance();
    } else if (this.isBalanceChangeMode) {
      this.confirmNewBalance();
    } else if (this.isTitleChangeMode) {
      this.confirmNewTitle();
    }
  }

  @action
  startEditingBalance() {
    this.newBalance = String(this.balance);
  }

  @action
  startChangingTitle() {
    this.newTitle = this.wallet?.title ?? '';
  }

  @action
  confirmNewBalance() {
    this.scenario.execute({
      scenario: 'UpdateWallet',
      payload: {
        id: this.wallet.id,
        balance: Number(this.newBalance),
      },
    });
    this.newBalance = null;
  }

  @action
  confirmNewTitle() {
    assert(this.newTitle !== null, 'Title is not specified');

    this.scenario.execute({
      scenario: 'UpdateWallet',
      payload: {
        id: this.wallet.id,
        title: this.newTitle,
      },
    });
    this.newTitle = null;
  }

  @action
  cancel() {
    this.newBalance = null;
    this.newTitle = null;
  }
}

import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { observable, computed, action, makeAutoObservable } from 'mobx';
import { Fund } from '../../entities/fund';
import { TOKENS } from '../../lib/app/di';
import { ScenarioRunner } from '../../services/scenario-runner';
import { asMoney } from '../../../../../libs/formatting/money';

@provide(MainFundController)
export class MainFundController {
  constructor(
    @inject(TOKENS.FundStore)
    private funds: Fund,
    @inject(ScenarioRunner)
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

  @computed get balance() {
    return this.funds.mainFundBalance;
  }

  @computed get formattedBalance() {
    return asMoney(this.balance ?? 0);
  }

  @computed get title() {
    return this.funds.mainFund?.title ?? 'my wallet';
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
    this.newTitle = this.funds.mainFund?.title ?? '';
  }

  @action
  confirmNewBalance() {
    this.scenario.execute({
      scenario: 'UpdateFund',
      payload: {
        id: this.funds.mainFund?.id,
        balance: Number(this.newBalance),
      },
    });
    this.newBalance = null;
  }

  @action
  confirmNewTitle() {
    this.scenario.execute({
      scenario: 'UpdateFund',
      payload: {
        id: this.funds.mainFund?.id,
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

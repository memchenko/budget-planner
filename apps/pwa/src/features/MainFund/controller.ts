import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { observable, computed, action, makeAutoObservable } from 'mobx';
import { Fund } from '../../entities/fund';
import { TOKENS } from '../../lib/misc/di';
import { ScenarioRunner } from '../../services/scenarioRunner';

@provide(MainFundController)
export class MainFundController {
  @inject(TOKENS.FundStore) funds!: Fund;
  @inject(ScenarioRunner) scenario!: ScenarioRunner;

  constructor() {
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

  @computed get mainFundBalance() {
    return this.funds.mainFundBalance;
  }

  @computed get mainFundTitle() {
    return this.funds.mainFund?.title ?? '';
  }

  @computed get isBalanceChangeMode() {
    return this.newBalance !== null;
  }

  @computed get isTitleChangeMode() {
    return this.newTitle !== null;
  }

  @action
  handleEditBalanceClick() {
    this.newBalance = String(this.mainFundBalance);
  }

  @action
  handleChangeTitleClick() {
    this.newTitle = this.funds.mainFund?.title ?? '';
  }

  @action
  handleNewBalanceInputChange(value: string) {
    this.newBalance = value;
  }

  @action
  handleNewTitleInputChange(value: string) {
    this.newTitle = value;
  }

  @action
  handleConfirmBalanceClick() {
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
  handleConfirmTitleClick() {
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
  handleCancelEditBalanceClick() {
    this.newBalance = null;
  }

  @action
  handleCancelChangingTitleClick() {
    this.newTitle = null;
  }
}

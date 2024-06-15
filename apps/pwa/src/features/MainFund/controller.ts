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

  @observable newBalance: number | null = null;

  @computed get mainFundBalance() {
    return this.funds.mainFundBalance;
  }

  @computed get isBalanceChangeMode() {
    return this.newBalance !== null;
  }

  @action
  handleEditBalanceClick() {
    this.newBalance = this.mainFundBalance;
  }

  @action
  handleInputChange(value: string) {
    this.newBalance = Number(value);
  }

  @action
  handleConfirmBalanceClick() {
    this.scenario.execute({
      scenario: 'UpdateFund',
      payload: {
        id: this.funds.mainFund?.id,
        balance: this.newBalance,
      },
    });
    this.newBalance = null;
  }

  @action
  handleCancelEditBalanceClick() {
    this.newBalance = null;
  }
}

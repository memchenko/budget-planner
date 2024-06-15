import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { observable, computed, action, makeAutoObservable } from 'mobx';
import autoBind from 'auto-bind';
import { TOKENS } from '../../lib/misc/di';
import { getMainFundBalance, getMainFund } from '../../entities/fund';
import { execute } from '../../services/scenarioRunner';

@provide(MainFundController)
export class MainFundController {
  constructor(@inject(TOKENS.Store) private store: Store) {
    makeAutoObservable(this);

    store.subscribe(() => {
      this.mainFundBalance = getMainFundBalance(store);
    });
    this.mainFundBalance = getMainFundBalance(store);

    autoBind(this);
  }

  @observable newBalance: number | null = null;
  @observable mainFundBalance: number | null = null;

  @computed get isBalanceChangeMode() {
    return this.newBalance !== null;
  }

  @action handleEditBalanceClick() {
    this.newBalance = this.mainFundBalance;
  }

  @action handleInputChange(value: string) {
    this.newBalance = Number(value);
  }

  @action handleConfirmBalanceClick() {
    this.store.dispatch(
      execute({
        scenario: 'UpdateFund',
        payload: {
          id: getMainFund(this.store)?.id,
          balance: this.newBalance,
        },
      }),
    );
    this.newBalance = null;
  }

  @action handleCancelEditBalanceClick() {
    this.newBalance = null;
  }
}

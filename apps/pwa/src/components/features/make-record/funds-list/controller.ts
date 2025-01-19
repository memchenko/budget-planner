import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { TOKENS } from '~/shared/constants/di';
import * as fund from '~/stores/fund';

@provide(FundsListController)
export class FundsListController {
  constructor(@inject(TOKENS.FUND_STORE) private readonly fund: fund.Fund) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get allFunds() {
    return this.fund.all
      .filter((value): value is fund.EntityType => value !== null)
      .map(({ id, title }) => ({
        id,
        title,
      }));
  }
}

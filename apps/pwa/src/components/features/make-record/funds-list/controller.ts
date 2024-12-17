import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { TOKENS } from '~/shared/app/di';
import * as fund from '~/entities/fund';

@provide(FundsListController)
export class FundsListController {
  constructor(@inject(TOKENS.FundStore) private readonly fund: fund.Fund) {
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

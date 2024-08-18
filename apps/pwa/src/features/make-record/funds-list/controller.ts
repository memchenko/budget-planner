import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { TOKENS } from '../../../lib/app/di';
import { Fund, EntityType } from '../../../entities/fund';

@provide(FundsListController)
export class FundsListController {
  constructor(@inject(TOKENS.FundStore) private fund: Fund) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get allFunds() {
    return [...this.fund.allButMain, this.fund.mainFund]
      .filter((value): value is EntityType => value !== null)
      .map(({ id, title, isMain }) => ({
        id,
        title: isMain ? 'Unspecified (wallet)' : title,
      }));
  }
}

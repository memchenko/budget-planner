import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { computed, makeAutoObservable } from 'mobx';
import { Fund } from '../../entities/fund';
import { TOKENS } from '../../lib/app/di';

@provide(FundsController)
export class FundsController {
  constructor(@inject(TOKENS.FundStore) private fundsStore: Fund) {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

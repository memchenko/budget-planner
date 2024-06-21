import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { computed, makeAutoObservable } from 'mobx';
import { Fund } from '../../entities/fund';
import { TOKENS } from '../../lib/app/di';
import { asMoney } from '../../lib/formatting/numbers';

@provide(FundsController)
export class FundsController {
  constructor(@inject(TOKENS.FundStore) private fundsStore: Fund) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  @computed
  get funds() {
    return this.fundsStore.allButMain
      .slice()
      .sort((a, b) => b.priority - a.priority)
      .map(({ id, balance, capacity, title }) => ({
        id,
        balance,
        capacity,
        title: title || 'Untitled',
        ratioText: `${asMoney(balance)} of ${asMoney(capacity)}`,
      }));
  }
}

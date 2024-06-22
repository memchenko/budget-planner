import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { computed, makeAutoObservable } from 'mobx';
import { DateTime } from 'luxon';
import { Fund } from '../../entities/fund';
import { TOKENS } from '../../lib/app/di';
import { asMoney } from '../../../../../libs/formatting/money';

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
      .map(({ id, balance, capacity, title, calculateDailyLimit }) => {
        const result = {
          id,
          balance,
          capacity,
          title: title || 'Untitled',
          ratioText: `${asMoney(balance)} of ${asMoney(capacity)}`,
          remainderGeometry: { width: '0', left: '100%' },
        };

        if (calculateDailyLimit) {
          const dailyRemainder = this.getDailyRemainder(id);
          const relativeWidth = Math.abs(dailyRemainder / capacity) * 100;
          console.log(dailyRemainder, capacity, dailyRemainder / capacity, relativeWidth);
          result.remainderGeometry = {
            width: relativeWidth + '%',
            left: dailyRemainder < 0 ? '100%' : 100 - relativeWidth + '%',
          };
        }

        return result;
      });
  }

  getDailyRemainder(fundId: string) {
    const fund = this.fundsStore.getFund(fundId);
    const { daysInMonth } = DateTime.now();
    const allowedDailyLimit = (fund?.capacity ?? 0) / daysInMonth;
    const daysLeft = daysInMonth - DateTime.now().get('day');
    const fundBalance = fund?.balance ?? 0;
    const expectedIdealBalance = allowedDailyLimit * daysLeft;

    return fundBalance - expectedIdealBalance;
  }
}

import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { action, computed, makeAutoObservable } from 'mobx';
import { DateTime } from 'luxon';
import { Fund } from '../../entities/fund';
import { TOKENS } from '../../lib/app/di';

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
          remainderGeometry: { width: '0', left: '100%' },
          dailyRemainder: null as number | null,
        };

        if (calculateDailyLimit) {
          const dailyRemainder = this.getDailyRemainder(id);
          const relativeWidth = Math.abs(dailyRemainder / capacity) * 100;

          result.remainderGeometry = {
            width: relativeWidth + '%',
            left: dailyRemainder < 0 ? '100%' : 100 - relativeWidth + '%',
          };
          result.dailyRemainder = dailyRemainder;
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

  @action
  handleSortEnd(oldIndex: number, newIndex: number) {}
}

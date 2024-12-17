import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { computed, makeAutoObservable, observable, action } from 'mobx';
import { DateTime } from 'luxon';
import { Fund } from '~/entities/fund';
import { User } from '~/entities/user';
import { TOKENS } from '~/shared/app/di';
import { ScenarioRunner } from '~/shared/impl/scenario-runner';

export enum Mode {
  View = 'view',
  Reorder = 'reorder',
}

@provide(FundsController)
export class FundsController {
  constructor(
    @inject(TOKENS.FundStore)
    private fundsStore: Fund,
    @inject(TOKENS.ScenarioRunner)
    private scenarioRunner: ScenarioRunner,
    @inject(TOKENS.UserStore)
    private userStore: User,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  @observable mode: Mode = Mode.View;

  @computed
  get hasFunds() {
    return this.fundsStore.hasFunds;
  }

  @computed
  get funds() {
    return this.fundsStore.all
      .slice()
      .sort((a, b) => a.priority - b.priority)
      .map(({ id, balance, capacity, title, calculateDailyLimit, priority }) => {
        const result = {
          id,
          balance,
          capacity,
          title: title || 'Untitled',
          remainderLeft: '100%',
          remainderWidth: '0',
          dailyRemainder: null as number | null,
          priority,
        };

        if (calculateDailyLimit) {
          const dailyRemainder = this.getDailyRemainder(id);
          const relativeWidth = Math.abs(dailyRemainder / capacity) * 100;

          result.remainderLeft = dailyRemainder < 0 ? '100%' : 100 - relativeWidth + '%';
          result.remainderWidth = relativeWidth + '%';
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
  enableViewMode() {
    this.mode = Mode.View;
  }

  @action
  enableReorderMode() {
    this.mode = Mode.Reorder;
  }

  @action
  reprioiritize(fundIds: string[]) {
    const funds = this.fundsStore.getManyFunds(fundIds);
    const updatedFunds = funds.map((fund) => {
      return {
        ...fund,
        priority: fundIds.indexOf(fund.id),
      };
    });
    this.fundsStore.updateMany(updatedFunds);

    this.enableViewMode();
  }

  @action
  distribute() {
    this.scenarioRunner.execute({
      scenario: 'DistributeBalance',
      payload: {
        userId: this.userStore.current.id,
      },
    });
  }
}

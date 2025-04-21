import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { computed, makeAutoObservable, observable, action } from 'mobx';
import { DateTime } from 'luxon';
import * as fundStore from '~/stores/fund';
import { Wallet } from '~/stores/wallet';
import * as userStore from '~/stores/user';
import * as sharingRuleStore from '~/stores/sharing-rule';
import * as synchronizationOrderStore from '~/stores/synchronization-order';
import { TOKENS } from '~/shared/constants/di';
import { ScenarioRunner } from '~/shared/impl/scenario-runner';

export enum Mode {
  View = 'view',
  Reorder = 'reorder',
}

@provide(FundsController)
export class FundsController {
  constructor(
    @inject(TOKENS.FUND_STORE)
    private fundsStore: fundStore.Fund,
    @inject(TOKENS.WALLET_STORE)
    private walletsStore: Wallet,
    @inject(TOKENS.SCENARIO_RUNNER)
    private scenarioRunner: ScenarioRunner,
    @inject(TOKENS.USER_STORE)
    private userStore: userStore.User,
    @inject(TOKENS.SHARING_RULE_STORE)
    private readonly sharingRuleStore: sharingRuleStore.SharingRule,
    @inject(TOKENS.SYNCHRONIZATION_ORDER_STORE)
    private readonly synchronizationOrderStore: synchronizationOrderStore.SynchronizationOrder,
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
        const isUserOwner = this.sharingRuleStore.isUserOwner('fund', id, this.userStore.current.id);
        const result = {
          id,
          balance,
          capacity,
          title: title || 'Untitled',
          remainderLeft: '100%',
          remainderWidth: '0',
          dailyRemainder: null as number | null,
          priority,
          isShared: isUserOwner && this.sharingRuleStore.isEntityShared('fund', id),
          isUnsynced: this.synchronizationOrderStore.isEntityUnsynced('fund', id),
          isSyncing: this.synchronizationOrderStore.isSyncing,
          isExternal: !isUserOwner,
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
        walletId: this.walletsStore.default.id,
      },
    });
  }
}

import { action, computed, makeAutoObservable } from 'mobx';
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { matchPath, ParamParseKey } from 'react-router-dom';
import { assert } from 'ts-essentials';
import { ScenarioRunner, ScenarioPayloadMap } from '~/shared/impl/scenario-runner';
import { schema } from './schema';
import { z } from 'zod';
import { User, EntityType as UserEntity } from '~/stores/user';
import { Fund, EntityType as FundEntity } from '~/stores/fund';
import { TOKENS } from '~/shared/constants/di';
import { pages } from '~/shared/constants/pages';
import { DELETE_BUTTON_NAME, SUBMIT_BUTTON_NAME } from './constants';
import omitBy from 'lodash/reject';
import isNil from 'lodash/isNil';
import get from 'lodash/get';
import { SynchronizationOrder } from '~/stores/synchronization-order';
import { SharingRule } from '~/stores/sharing-rule';
import { fund } from '#/libs/core/shared/schemas';
import { INavigateFunc } from '~/shared/interfaces';

@provide(EditFundController)
export class EditFundController {
  id!: string;
  fund!: FundEntity;

  constructor(
    @inject(TOKENS.SCENARIO_RUNNER) private readonly scenarioRunner: ScenarioRunner,
    @inject(TOKENS.USER_STORE) private readonly userStore: User,
    @inject(TOKENS.FUND_STORE) private readonly fundStore: Fund,
    @inject(TOKENS.SYNCHRONIZATION_ORDER_STORE) private readonly synchronizationOrder: SynchronizationOrder,
    @inject(TOKENS.SHARING_RULE_STORE) private readonly sharingRule: SharingRule,
    @inject(TOKENS.NAVIGATE_FUNC) private readonly navigate: INavigateFunc,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.getFundId();
    this.getFund();
  }

  @computed
  get users() {
    return this.userStore.externals;
  }

  getFundId() {
    const id = matchPath<ParamParseKey<typeof pages.editFund>, typeof pages.editFund>(
      pages.editFund,
      window.location.pathname,
    )?.params.id;

    assert(id, 'Invalid route. ID of fund is missing.');

    this.id = id;
  }

  getFund() {
    const fund = this.fundStore.getFund(this.id);

    assert(fund, `Fund with ID ${this.id} doesn't exist.`);

    this.fund = fund;
  }

  get initialValues(): z.infer<typeof schema> {
    const { title, capacity, balance, isCumulative, isEager, calculateDailyLimit } = this.fund;

    return {
      name: title,
      capacity: capacity,
      balance: balance,
      isCumulative: isCumulative,
      takeDeficitFromWallet: isEager,
      calculateDailyLimit: calculateDailyLimit,
    };
  }

  @action
  handleSubmit(data: z.infer<typeof schema>, event?: React.BaseSyntheticEvent) {
    const name = get(event, ['nativeEvent', 'submitter', 'name']);

    assert(name, 'Cannot update fund. Event is missing.');
    assert(this.fund.id, 'Cannot delete fund. ID is missing.');

    if (name === SUBMIT_BUTTON_NAME) {
      this.handleEdit(data);
    } else if (name === DELETE_BUTTON_NAME) {
      this.handleDelete();
    } else {
      throw new Error(`Unknown event: ${name}`);
    }

    this.navigate(pages.index);
  }

  @action
  handleEdit(data: z.infer<typeof schema>) {
    const payload = omitBy(
      {
        id: this.fund.id,
        title: data.name,
        capacity: data.capacity,
        isCumulative: data.isCumulative,
        balance: data.balance,
        isEager: data.takeDeficitFromWallet,
        calculateDailyLimit: data.calculateDailyLimit,
      },
      isNil,
    ) as ScenarioPayloadMap['UpdateFund']['payload'];

    this.scenarioRunner.execute({
      scenario: 'UpdateFund',
      payload,
    });
  }

  @action
  handleDelete() {
    this.scenarioRunner.execute({
      scenario: 'DeleteFund',
      payload: {
        fundId: this.fund.id,
        userId: this.userStore.current.id,
      },
    });
  }

  @action
  async handleUserSelected(id: UserEntity['id']) {
    await this.scenarioRunner.execute({
      scenario: 'CreateSharingRule',
      payload: {
        userId: id,
        entityId: this.fund.id,
        entity: fund,
        actions: ['list', 'read-balance', 'write-cost'],
      },
    });

    const sharingRule = this.sharingRule.all[0];

    assert(sharingRule, '');

    const date = Date.now();

    this.synchronizationOrder.add({
      id: sharingRule.id,
      userId: id,
      entity: fund,
      entityId: this.fund.id,
      action: 'create',
      createdAt: date,
      updatedAt: date,
    });
  }
}

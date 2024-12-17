import { action, makeAutoObservable, observable } from 'mobx';
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { matchPath, ParamParseKey } from 'react-router-dom';
import { assert } from 'ts-essentials';
import { ScenarioRunner, ScenarioPayloadMap } from '~/modules/scenario-runner';
import { schema } from './schema';
import { z } from 'zod';
import { User } from '~/entities/user';
import { Fund, EntityType as FundEntity } from '~/entities/fund';
import { TOKENS } from '~/shared/app/di';
import { pages } from '~/shared/app/pages';
import { DELETE_BUTTON_NAME, SUBMIT_BUTTON_NAME } from './constants';
import omitBy from 'lodash/reject';
import isNil from 'lodash/isNil';
import get from 'lodash/get';

@provide(EditFundController)
export class EditFundController {
  id!: string;
  fund!: FundEntity;

  constructor(
    @inject(TOKENS.ScenarioRunner)
    private scenarioRunner: ScenarioRunner,
    @inject(TOKENS.UserStore)
    private userStore: User,
    @inject(TOKENS.FundStore)
    private fundStore: Fund,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.getFundId();
    this.getFund();
  }

  @observable
  isSubmitted = false;

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
      this.handleEdit(this.fund.id, data);
    } else if (name === DELETE_BUTTON_NAME) {
      this.handleDelete(this.fund.id);
    } else {
      throw new Error(`Unknown event: ${name}`);
    }

    this.isSubmitted = true;
  }

  @action
  handleEdit(id: string, data: z.infer<typeof schema>) {
    const payload = omitBy(
      {
        id,
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
  handleDelete(id: string) {
    this.scenarioRunner.execute({
      scenario: 'DeleteFund',
      payload: {
        fundId: id,
        userId: this.userStore.current.id,
      },
    });
  }
}

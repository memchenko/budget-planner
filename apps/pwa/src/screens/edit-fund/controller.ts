import { action, computed, makeAutoObservable, observable } from 'mobx';
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { matchPath, ParamParseKey } from 'react-router-dom';
import { assert } from 'ts-essentials';
import { ScenarioRunner, ScenarioPayloadMap } from '../../services/scenarioRunner';
import { schema } from './schema';
import { z } from 'zod';
import { User } from '../../entities/user';
import { Fund } from '../../entities/fund';
import { TOKENS } from '../../lib/app/di';
import { pages } from '../../lib/app/pages';
import { DELETE_BUTTON_NAME, SUBMIT_BUTTON_NAME } from './constants';
import { hasProperty } from '../../lib/type-guards';
import omitBy from 'lodash/reject';
import isNil from 'lodash/isNil';

@provide(EditFundController)
export class EditFundController {
  constructor(
    @inject(ScenarioRunner)
    private scenarioRunner: ScenarioRunner,
    @inject(TOKENS.UserStore)
    private userStore: User,
    @inject(TOKENS.FundStore)
    private fundStore: Fund,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  id?: string;

  @observable
  isSubmitted = false;

  @computed
  get fund() {
    const match = matchPath<ParamParseKey<typeof pages.editFund>, typeof pages.editFund>(
      pages.editFund,
      window.location.pathname,
    );

    assert(match?.params.id, 'Invalid route. ID of fund is missing.');

    const fund = this.fundStore.getFund(match.params.id);

    assert(fund, `Fund with ID ${match.params.id} doesn't exist.`);

    return fund;
  }

  @action
  handleSubmit(data: z.infer<typeof schema>, event?: React.BaseSyntheticEvent) {
    assert(event && hasProperty(event, 'name'), 'Cannot update fund. Event is missing.');
    assert(this.fund.id, 'Cannot delete fund. ID is missing.');

    if (event.name === SUBMIT_BUTTON_NAME) {
      this.handleEdit(this.fund.id, data);
    } else if (event.name === DELETE_BUTTON_NAME) {
      this.handleDelete(this.fund.id);
    } else {
      throw new Error(`Unknown event: ${event.name}`);
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

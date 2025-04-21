import { action, makeAutoObservable } from 'mobx';
import { fluentProvide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { ScenarioRunner, ScenarioPayloadMap } from '~/shared/impl/scenario-runner';
import { schema } from './schema';
import { z } from 'zod';
import { User } from '~/stores/user';
import { TOKENS } from '~/shared/constants/di';
import { INavigateFunc } from '~/shared/interfaces';
import { pages } from '~/shared/constants/pages';

// prettier-ignore
@(fluentProvide(AddFundController).inTransientScope().done())
export class AddFundController {
  constructor(
    @inject(TOKENS.SCENARIO_RUNNER) private readonly scenarioRunner: ScenarioRunner,
    @inject(TOKENS.USER_STORE) private readonly userStore: User,
    @inject(TOKENS.NAVIGATE_FUNC) private readonly navigate: INavigateFunc,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  @action
  handleSubmit(data: z.infer<typeof schema>) {
    const payload: ScenarioPayloadMap['CreateFund']['payload'] = {
      title: data.name,
      capacity: data.capacity,
      priority: Number.MAX_SAFE_INTEGER,
      isCumulative: data.isCumulative ?? false,
      userId: this.userStore.current.id,
      balance: data.initialBalance ?? 0,
      isEager: data.takeDeficitFromWallet ?? false,
      calculateDailyLimit: data.calculateDailyLimit ?? false,
      externalWalletId: null,
    };

    this.scenarioRunner
      .execute({
        scenario: 'CreateFund',
        payload,
      })
      .then(() => {
        this.navigate(pages.index);
      });
  }
}

import { action, makeAutoObservable, observable } from 'mobx';
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { ScenarioRunner, ScenarioPayloadMap } from '~/shared/impl/scenario-runner';
import { schema } from './schema';
import { z } from 'zod';
import { User } from '~/entities/user';
import { TOKENS } from '~/shared/constants/di';

@provide(AddFundController)
export class AddFundController {
  constructor(
    @inject(TOKENS.SCENARIO_RUNNER)
    private scenarioRunner: ScenarioRunner,
    @inject(TOKENS.USERS_STORE)
    private userStore: User,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  @observable
  isSubmitted = false;

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

    this.scenarioRunner.execute({
      scenario: 'CreateFund',
      payload,
    });
    this.isSubmitted = true;
  }
}

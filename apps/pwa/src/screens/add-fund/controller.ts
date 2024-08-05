import { action, makeAutoObservable, observable } from 'mobx';
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { ScenarioRunner, ScenarioPayloadMap } from '../../services/scenarioRunner';
import { schema } from './schema';
import { z } from 'zod';
import { User } from '../../entities/user';
import { TOKENS } from '../../lib/app/di';

@provide(AddFundController)
export class AddFundController {
  constructor(
    @inject(ScenarioRunner)
    private scenarioRunner: ScenarioRunner,
    @inject(TOKENS.UserStore)
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
      isMain: false,
      userId: this.userStore.current.id,
      balance: data.initialBalance ?? 0,
      isEager: data.takeDeficitFromWallet ?? false,
      calculateDailyLimit: data.calculateDailyLimit ?? false,
    };

    this.scenarioRunner.execute({
      scenario: 'CreateFund',
      payload,
    });
    this.isSubmitted = true;
  }
}

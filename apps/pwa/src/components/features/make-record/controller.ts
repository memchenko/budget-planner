import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { makeAutoObservable, action, computed } from 'mobx';
import { TOKENS } from '~/shared/constants/di';
import { User } from '~/entities/user';
import { Wallet } from '~/entities/wallet';
import {
  AMOUNT_PROPERTY_NAME,
  FUND_PROPERTY_NAME,
  State,
  TAGS_LIST_PROPERTY_NAME,
  TYPE_OF_RECORD_PROPERTY_NAME,
  defaultValues,
} from './constants';
import { FormValues, formSchema } from './schema';
import { ScenarioRunner } from '~/shared/impl/scenario-runner';
import { fund, wallet } from '#/libs/core/shared/schemas';

@provide(MakeRecordController)
export class MakeRecordController {
  state = State.Idle;
  values = defaultValues;

  constructor(
    @inject(TOKENS.USERS_STORE) private user: User,
    @inject(TOKENS.SCENARIO_RUNNER) private scenarioRunner: ScenarioRunner,
    @inject(TOKENS.WALLETS_STORE) private wallet: Wallet,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get valueOfCurrentStep() {
    switch (this.state) {
      case State.TypeOfRecordStep:
        return this.values[TYPE_OF_RECORD_PROPERTY_NAME];
      case State.TagsStep:
        return this.values[TAGS_LIST_PROPERTY_NAME];
      case State.AmountStep:
        return this.values[AMOUNT_PROPERTY_NAME];
      case State.FundStep:
        return this.values[FUND_PROPERTY_NAME];
      default:
        return null;
    }
  }

  @computed
  get shouldEnableNextButton() {
    const value = this.valueOfCurrentStep;

    switch (this.state) {
      case State.TypeOfRecordStep:
        return formSchema.shape[TYPE_OF_RECORD_PROPERTY_NAME].safeParse(value).success;
      case State.TagsStep:
        return formSchema.safeParse(this.values).success;
      case State.AmountStep:
        return formSchema.shape[AMOUNT_PROPERTY_NAME].safeParse(value).success;
      case State.FundStep:
        return formSchema.shape[FUND_PROPERTY_NAME].safeParse(value).success;
      default:
        return false;
    }
  }

  @action
  setValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    this.values[key] = value;
  }

  @action
  reset() {
    this.state = State.Idle;
    this.values = defaultValues;
  }

  @action
  start() {
    this.state = State.TypeOfRecordStep;
  }

  @action
  next() {
    switch (this.state) {
      case State.TypeOfRecordStep:
        this.state = State.AmountStep;
        break;
      case State.AmountStep:
        this.state = State.FundStep;
        break;
      case State.FundStep:
        this.state = State.TagsStep;
        break;
      default:
        this.state = State.Idle;
    }
  }

  @action
  forceStep(state: State) {
    this.state = state;
  }

  @action
  finish() {
    const commonPayload = {
      userId: this.user.current.id,
      tagsIds: this.values[TAGS_LIST_PROPERTY_NAME].map(({ id }) => id),
      amount: this.values[AMOUNT_PROPERTY_NAME],
      date: Date.now(),
      note: '',
    };

    if (this.values[TYPE_OF_RECORD_PROPERTY_NAME] === 'cost') {
      this.scenarioRunner.execute({
        scenario: 'AddCost',
        payload: {
          ...commonPayload,
          entity: fund,
          entityId: this.values[FUND_PROPERTY_NAME],
        },
      });
    } else {
      this.scenarioRunner.execute({
        scenario: 'AddIncome',
        payload: {
          ...commonPayload,
          entity: wallet,
          entityId: this.wallet.default.id,
        },
      });
    }

    this.state = State.Idle;
  }
}

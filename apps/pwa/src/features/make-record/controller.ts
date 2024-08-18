import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { makeAutoObservable, action } from 'mobx';
import { TOKENS } from '../../lib/app/di';
import { Cost } from '../../entities/cost';
import { Income } from '../../entities/income';

export enum State {
  Idle,
  TypeOfRecordStep,
  AmountStep,
  FundStep,
  TagsStep,
}

@provide(MakeRecordController)
export class MakeRecordController {
  state = State.Idle;

  constructor(
    @inject(TOKENS.CostStore) private cost: Cost,
    @inject(TOKENS.IncomeStore) private income: Income,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  @action
  reset() {
    this.state = State.Idle;
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
}

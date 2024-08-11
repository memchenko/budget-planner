import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { computed, makeAutoObservable, observable, action } from 'mobx';
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
    this.state = State.TagsStep;
  }
}

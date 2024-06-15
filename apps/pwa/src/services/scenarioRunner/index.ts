import { action, makeAutoObservable, observable } from 'mobx';
import { injectable } from 'inversify';
import { ScenariosDict, ScenarioPayloadMap, ScenarioState } from './types';
import { scenarios } from '../../../../../libs/core';
import { container } from '../../configs/inversify.config';

@injectable()
export class ScenarioRunner {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  @observable name: keyof ScenariosDict | null = null;
  @observable state: ScenarioState = 'idle';
  @observable error: unknown | null = null;

  @action
  async execute<S extends keyof ScenariosDict>(parameters: ScenarioPayloadMap[S]) {
    const { scenario: scenarioName, payload } = parameters;
    const scenario = container.resolve<{ run: (arg: any) => {} }>(scenarios[scenarioName] as any);

    await scenario.run(payload);
  }

  @action
  pending(scenarioName: keyof ScenariosDict) {
    this.name = scenarioName;
    this.state = 'in-progress';
    this.error = null;
  }

  @action
  rejected(error: unknown) {
    this.state = 'error';
    this.error = error ?? null;
  }

  @action
  fulfilled() {
    this.state = 'completed';
  }
}

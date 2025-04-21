import { action, makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { ScenariosDict, ScenarioPayloadMap } from './types';
import { scenarios } from '#/libs/core';
import { container } from '~/app/inversify.config';

export * from './types';

@injectable()
export class ScenarioRunner {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  @action
  async execute<S extends keyof ScenariosDict>(parameters: ScenarioPayloadMap[S]) {
    const { scenario: scenarioName, payload } = parameters;
    const scenario = container.resolve<{ run: (arg: any) => void }>(scenarios[scenarioName] as any);

    return await scenario.run(payload);
  }
}

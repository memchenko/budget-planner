import { injectable } from 'inversify';
import { Scenario } from './types';
import { ScenarioError } from '#/libs/core/errors/ScenarioError';

@injectable()
export abstract class BaseScenario<P extends object, R = void> implements Scenario<P, R> {
  error: unknown;
  params!: P;

  async run(params: P) {
    try {
      this.params = params;
      return await this.execute();
    } catch (err: unknown) {
      let errorText = `Couldn't execute scenario ${this.constructor.name}`;
      const scenarioError = (this.error = new ScenarioError(errorText));
      scenarioError.scenario = this.constructor;
      scenarioError.executionError = err;

      try {
        await this.revert();

        scenarioError.reason = 'execution';
      } catch (err: unknown) {
        errorText = `Couldn't revert scenario ${this.constructor.name}`;
        scenarioError.reason = 'revertion';
        scenarioError.revertionError;
      } finally {
        throw scenarioError;
      }
    }
  }
  abstract execute(): Promise<R>;
  abstract revert(): Promise<void>;
}

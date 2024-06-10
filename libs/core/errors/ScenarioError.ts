export class ScenarioError<P extends {}, R> extends Error {
  reason!: 'execution' | 'revertion';
  scenario!: Function;
  executionError!: unknown;
  revertionError!: unknown;
}

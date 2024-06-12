export class ScenarioError extends Error {
  reason!: 'execution' | 'revertion';
  scenario!: Function;
  executionError!: unknown;
  revertionError!: unknown;
}

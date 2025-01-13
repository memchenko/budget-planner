export class ScenarioError extends Error {
  reason!: 'execution' | 'revertion';
  scenario!: unknown;
  executionError!: unknown;
  revertionError!: unknown;
}

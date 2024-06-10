export interface Scenario<Result = void> {
  run(): Promise<Result>;
  execute(): Promise<Result>;
  revert(): Promise<void>;
}

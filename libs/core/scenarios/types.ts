export interface Scenario<P extends {}, Result = void> {
  params: P;
  run(params: P): Promise<Result>;
  execute(): Promise<Result>;
  revert(): Promise<void>;
}

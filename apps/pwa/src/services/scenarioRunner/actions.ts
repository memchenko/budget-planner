import { createAsyncThunk, AsyncThunkAction } from '@reduxjs/toolkit';
import { scenarios } from '../../../../../libs/core';
import { ScenariosDict, ScenarioPayloadMap, ExecuteActionPayload } from './types';
import { container } from '../../configs/inversify.config';

export const EXECUTE_ACTION_TYPE = 'scenarioRunner/execute';

export const _execute = createAsyncThunk(EXECUTE_ACTION_TYPE, async (parameters: ExecuteActionPayload) => {
  const { scenario: scenarioName, payload } = parameters;
  const scenario = container.resolve<{ run: (arg: any) => {} }>(scenarios[scenarioName] as any);

  await scenario.run(payload);
});

export const execute = <S extends keyof ScenariosDict>(
  parameters: ScenarioPayloadMap[S],
): AsyncThunkAction<any, any, any> => {
  return _execute(parameters);
};

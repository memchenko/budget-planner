import { createAction, PayloadAction } from '@reduxjs/toolkit';

import { Scenario, ScenarioPayloadMap } from './types';

export const EXECUTE_ACTION_TYPE = 'scenarioRunner/execute';

export const execute = <S extends keyof Scenario>(
  parameters: ScenarioPayloadMap[S],
): PayloadAction<ScenarioPayloadMap[S], typeof EXECUTE_ACTION_TYPE> => {
  const actionCreator = createAction<ScenarioPayloadMap[S], typeof EXECUTE_ACTION_TYPE>(EXECUTE_ACTION_TYPE);

  return actionCreator(parameters);
};

import { createListenerMiddleware, PayloadActionCreator } from '@reduxjs/toolkit';
import { scenarios, ScenarioError } from '../../../../../libs/core';
import { actions } from './slice';
import { execute, EXECUTE_ACTION_TYPE } from './actions';
import { ExecuteActionPayload } from './types';

export * from './slice';
export * from './types';
export * from './actions';

const listenerMiddlerware = createListenerMiddleware();

type ExecuteActionCreatorType = PayloadActionCreator<ExecuteActionPayload, typeof EXECUTE_ACTION_TYPE>;

listenerMiddlerware.startListening({
  actionCreator: execute as ExecuteActionCreatorType,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    const { payload } = action;
    const Scenario = scenarios[payload.scenario];
    const scenario = new Scenario(payload.payload as any);

    try {
      await scenario.run();
      listenerApi.dispatch(actions.complete());
    } catch (error) {
      if (error instanceof ScenarioError) {
        listenerApi.dispatch(actions.error({ error }));
      }
    }
  },
});

export const { middleware } = listenerMiddlerware;

import { createListenerMiddleware } from '@reduxjs/toolkit';
import { scenarios, ScenarioError } from '../../../../../libs/core';
import { actions } from './slice';

export * from './slice';

const listenerMiddlerware = createListenerMiddleware();

listenerMiddlerware.startListening({
  actionCreator: actions.execute,
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

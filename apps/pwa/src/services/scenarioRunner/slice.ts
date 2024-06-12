import { createSlice, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { Scenario, ExecuteActionPayload } from './types';
import { ScenarioError } from '../../../../../libs/core';
import { execute } from './actions';

export type ScenarioState = 'idle' | 'in-progress' | 'error' | 'completed';

export type State = {
  name: keyof Scenario | null;
  state: ScenarioState;
  error: ScenarioError | null;
};

const initialState: State = {
  name: null,
  state: 'idle',
  error: null,
};

export const slice = createSlice({
  name: 'scenarioRunner',
  initialState,
  reducers: {
    complete: (state) => {
      state.state = 'completed';
    },
    error: (state, action: { payload: { error: ScenarioError } }) => {
      state.state = 'error';
      state.error = action.payload.error;
    },
  },
  extraReducers(builder) {
    builder.addCase(execute as ActionCreatorWithPayload<ExecuteActionPayload, string>, (state, action) => {
      state.name = action.payload.scenario;
      state.state = 'in-progress';
      state.error = null;
    });
  },
});

export const { actions, reducer } = slice;

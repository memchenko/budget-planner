import { createSlice } from '@reduxjs/toolkit';
import { Scenario, ScenarioPayloadMap } from './types';
import { ScenarioError } from '../../../../../libs/core';

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
    execute: (state, action: { payload: ScenarioPayloadMap[keyof Scenario] }) => {
      state.name = action.payload.scenario;
      state.state = 'in-progress';
      state.error = null;
    },
    complete: (state) => {
      state.state = 'completed';
    },
    error: (state, action: { payload: { error: ScenarioError } }) => {
      state.state = 'error';
      state.error = action.payload.error;
    },
  },
});

export const { actions, reducer } = slice;

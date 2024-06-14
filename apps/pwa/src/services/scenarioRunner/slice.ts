import { createSlice } from '@reduxjs/toolkit';
import { ScenariosDict } from './types';
import { _execute } from './actions';

export type ScenarioState = 'idle' | 'in-progress' | 'error' | 'completed';

export type State = {
  name: keyof ScenariosDict | null;
  state: ScenarioState;
  error: unknown | null;
};

const initialState: State = {
  name: null,
  state: 'idle',
  error: null,
};

export const slice = createSlice({
  name: 'scenarioRunner',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(_execute.pending, (state, action) => {
      state.name = action.meta.arg.scenario;
      state.state = 'in-progress';
      state.error = null;
    });

    builder.addCase(_execute.rejected, (state, action) => {
      state.state = 'error';
      state.error = action.error ?? null;
    });

    builder.addCase(_execute.fulfilled, (state) => {
      state.state = 'completed';
    });
  },
});

export const { actions, reducer } = slice;

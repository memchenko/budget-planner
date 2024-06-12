import { scenarios } from '../../../../../libs/core';

export type Scenario = typeof scenarios;

export type ScenarioPayloadMap = {
  [Key in keyof Scenario]: {
    scenario: Key;
    payload: Scenario[Key];
  };
};

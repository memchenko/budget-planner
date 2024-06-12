import { scenarios } from '../../../../../libs/core';

export type Scenario = typeof scenarios;

export type ScenarioPayloadMap = {
  [Key in keyof Scenario]: {
    scenario: Key;
    payload: ConstructorParameters<Scenario[Key]>[0];
  };
};

export type ExecuteActionPayload = ScenarioPayloadMap[keyof Scenario];

import { scenarios } from '../../../../../libs/core';

export type ScenariosDict = typeof scenarios;

export type ScenarioPayloadMap = {
  [Key in keyof ScenariosDict]: {
    scenario: Key;
    payload: Parameters<ScenariosDict[Key]['prototype']['run']>[0];
  };
};

export type ExecuteActionPayload = ScenarioPayloadMap[keyof ScenariosDict];

export type ScenarioState = 'idle' | 'in-progress' | 'error' | 'completed';

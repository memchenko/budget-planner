import { TOKENS as CORE_TOKENS } from '#/libs/core';

export const TOKENS = {
  ...CORE_TOKENS,
  DictionariesStore: Symbol.for('DictionariesStore'),
  UserStore: Symbol.for('UserStore'),
  CostStore: Symbol.for('CostStore'),
  IncomeStore: Symbol.for('IncomeStore'),
  TagStore: Symbol.for('TagStore'),
  FundStore: Symbol.for('FundStore'),
  WalletStore: Symbol.for('WalletStore'),

  // Modules
  EventBus: Symbol.for('EventBus'),
  WebRTC: Symbol.for('WebRTC'),
  Synchronizer: Symbol.for('Synchronizer'),
  ScenarioRunner: Symbol.for('ScenarioRunner'),

  // Events
  CostFromCollaborator: Symbol.for('CostFromCollaborator'),
  IncomeFromCollaborator: Symbol.for('IncomeFromCollaborator'),
  TagFromCollaborator: Symbol.for('TagFromCollaborator'),
  UserReady: Symbol.for('UserReady'),
};

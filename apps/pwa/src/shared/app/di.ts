import { TOKENS as CORE_TOKENS } from '#/libs/core';

export const TOKENS = {
  ...CORE_TOKENS,
  DICTIONARIES_STORE: Symbol.for('DictionariesStore'),
  USERS_STORE: Symbol.for('UserStore'),
  COSTS_STORE: Symbol.for('CostStore'),
  INCOMES_STORE: Symbol.for('IncomeStore'),
  TAGS_STORE: Symbol.for('TagStore'),
  FUNDS_STORE: Symbol.for('FundStore'),
  WALLETS_STORE: Symbol.for('WalletStore'),

  // Modules
  EVENT_BUS: Symbol.for('EventBus'),
  WEB_RTC: Symbol.for('WebRTC'),
  SYNCHRONIZER: Symbol.for('Synchronizer'),
  SCENARIO_RUNNER: Symbol.for('ScenarioRunner'),

  // Events
  EVENTS: {
    USER_READY: 'user-ready',
  } as const,
};

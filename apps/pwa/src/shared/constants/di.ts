import { TOKENS as CORE_TOKENS } from '#/libs/core';

export const TOKENS = {
  ...CORE_TOKENS,
  DICTIONARY_STORE: Symbol.for('DictionaryStore'),
  USER_STORE: Symbol.for('UserStore'),
  COST_STORE: Symbol.for('CostStore'),
  INCOME_STORE: Symbol.for('IncomeStore'),
  TAG_STORE: Symbol.for('TagStore'),
  FUND_STORE: Symbol.for('FundStore'),
  WALLET_STORE: Symbol.for('WalletStore'),
  SHARING_RULE_STORE: Symbol.for('SharingRuleStore'),
  SYNCHRONIZATION_ORDER_STORE: Symbol.for('SynchronizationOrderStore'),

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

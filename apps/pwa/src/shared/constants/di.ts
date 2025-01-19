import { TOKENS as CORE_TOKENS } from '#/libs/core';

export const TOKENS = {
  ...CORE_TOKENS,
  USER_STORE: Symbol.for('UserStore'),
  COST_STORE: Symbol.for('CostStore'),
  INCOME_STORE: Symbol.for('IncomeStore'),
  TAG_STORE: Symbol.for('TagStore'),
  FUND_STORE: Symbol.for('FundStore'),
  WALLET_STORE: Symbol.for('WalletStore'),
  SHARING_RULE_STORE: Symbol.for('SharingRuleStore'),
  SYNCHRONIZATION_ORDER_STORE: Symbol.for('SynchronizationOrderStore'),
  APP_STORE: Symbol.for('AppStore'),

  // Modules
  WEB_RTC: Symbol.for('WebRTC'),
  SYNCHRONIZER: Symbol.for('Synchronizer'),
  SCENARIO_RUNNER: Symbol.for('ScenarioRunner'),

  // Utils
  NAVIGATE_FUNC: Symbol.for('NAVIGATE'),

  // Events
  EVENTS: {
    USER_READY: 'user:ready',
    MODAL_SHOW: 'modal:show',
    MODAL_CLOSE: 'modal:close',
    NOTIFICATION_SHOW: 'notification:show',
  } as const,
};

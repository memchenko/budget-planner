import { TOKENS as CORE_TOKENS } from '../../../../../libs/core';

export const TOKENS = {
  ...CORE_TOKENS,
  DictionariesStore: Symbol.for('DictionariesStore'),
  UserStore: Symbol.for('UserStore'),
  CostStore: Symbol.for('CostStore'),
  IncomeStore: Symbol.for('IncomeStore'),
  TagStore: Symbol.for('TagStore'),
  FundStore: Symbol.for('FundStore'),
};

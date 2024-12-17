import { FormValues } from './schema';

export const TAGS_LIST_PROPERTY_NAME = 'tagsList';
export const TYPE_OF_RECORD_PROPERTY_NAME = 'typeOfRecord';
export const AMOUNT_PROPERTY_NAME = 'amount';
export const FUND_PROPERTY_NAME = 'fund';

export enum State {
  Idle,
  TypeOfRecordStep,
  AmountStep,
  FundStep,
  TagsStep,
}

export const defaultValues = {
  [TAGS_LIST_PROPERTY_NAME]: [],
  [TYPE_OF_RECORD_PROPERTY_NAME]: 'cost',
  [AMOUNT_PROPERTY_NAME]: 0,
  [FUND_PROPERTY_NAME]: null,
} as unknown as FormValues;

export const possibleSteps = new Set(Object.values(State).filter((value) => typeof value === 'number'));

import { State } from './controller';
import * as tag from '../../entities/tag';
import { TYPE_OF_RECORD_PROPERTY_NAME, TAGS_LIST_PROPERTY_NAME, AMOUNT_PROPERTY_NAME } from './constants';

export interface FormValues {
  [TYPE_OF_RECORD_PROPERTY_NAME]: 'cost' | 'income';
  [TAGS_LIST_PROPERTY_NAME]: tag.EntityType[];
  [AMOUNT_PROPERTY_NAME]: number;
}

export const getTitle = (state: State) => {
  switch (state) {
    case State.TypeOfRecordStep:
      return 'Choose type of record';
    case State.AmountStep:
      return 'Enter amount';
    case State.FundStep:
      return 'Choose fund';
    case State.TagsStep:
      return 'Choose tags';
    default:
      return '';
  }
};

export const shouldEnableNextButton = (
  state: State,
  getValue: <K extends keyof FormValues>(key: K) => FormValues[K],
) => {
  switch (state) {
    case State.TypeOfRecordStep:
      return Boolean(getValue(TYPE_OF_RECORD_PROPERTY_NAME));
    case State.TagsStep:
      return getValue(TAGS_LIST_PROPERTY_NAME)?.length > 0;
    case State.AmountStep:
      return getValue(AMOUNT_PROPERTY_NAME) > 0;
    default:
      return false;
  }
};

import { State } from './constants';
import { t } from '~/shared/translations';

export const getTitle = (state: State) => {
  switch (state) {
    case State.TypeOfRecordStep:
      return t('Choose type of record');
    case State.AmountStep:
      return t('Enter amount');
    case State.AccountStep:
      return t('Choose fund');
    case State.TagsStep:
      return t('Choose tags');
    default:
      return '';
  }
};

export const getNextButtonTitle = (state: State) => {
  if (state === State.TagsStep) {
    return t('Finish');
  } else {
    return t('Next');
  }
};

export const getSelectedKey = (state: State) => {
  switch (state) {
    case State.TypeOfRecordStep:
      return '0';
    case State.AmountStep:
      return '1';
    case State.AccountStep:
      return '2';
    case State.TagsStep:
      return '3';
    default:
      return '';
  }
};

import { State } from './constants';

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

export const getNextButtonTitle = (state: State) => {
  if (state === State.TagsStep) {
    return 'Finish';
  } else {
    return 'Next';
  }
};

export const getSelectedKey = (state: State) => {
  switch (state) {
    case State.TypeOfRecordStep:
      return '1';
    case State.AmountStep:
      return '2';
    case State.FundStep:
      return '3';
    case State.TagsStep:
      return '4';
    default:
      return '';
  }
};

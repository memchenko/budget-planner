import { State } from './controller';

export const getTitle = (state: State) => {
  if (state === State.TagsStep) {
    return 'Choose tags';
  }
};

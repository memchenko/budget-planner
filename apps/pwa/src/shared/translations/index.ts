import get from 'lodash/get';

import * as ru from './ru.json';
import * as en from './en.json';

const language = navigator.language.split('-')[0];
const dicts = {
  en,
  ru,
};

export const t = (str: string): string => {
  const translation = get(dicts, [language, str], null);

  if (translation !== null) return translation;

  return get(en, str, '');
};

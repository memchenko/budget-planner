import get from 'lodash/get';

import ru from './ru.json';
import en from './en.json';

const language = navigator.language.split('-')[0];
const dicts = {
  en,
  ru,
};

export const t = (str: string): string => {
  const translation = get(dicts, [language, str], null);

  if (translation !== null) return translation;

  return get(en, str, null) ?? str;
};

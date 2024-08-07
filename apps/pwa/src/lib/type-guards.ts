export const hasProperty = <K extends PropertyKey, O extends object>(obj: O, key: K): obj is O & Record<K, unknown> => {
  return key in obj;
};

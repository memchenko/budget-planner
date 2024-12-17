import { z } from 'zod';

export const hasProperty = <K extends PropertyKey, O extends object>(obj: O, key: K): obj is O & Record<K, unknown> => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

export const matchesSchema = <S extends z.ZodSchema>(value: unknown, schema: S): value is z.infer<S> => {
  return schema.safeParse(value).success;
};

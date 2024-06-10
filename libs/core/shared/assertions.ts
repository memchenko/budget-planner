import { assert } from 'ts-essentials';

export function assertEntity<E>(entity: E, name: string): asserts entity is Exclude<E, null> {
  assert(entity !== null, `Entity "${name}" doesn't exist.`);
}

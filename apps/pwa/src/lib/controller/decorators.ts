import type { IController } from './types';

export const Param = <T extends IController, K extends Extract<keyof T, string>>(target: T, key: K) => {
  const hiddenKey = `__${key}` as K;

  Object.defineProperty(target, hiddenKey, {
    enumerable: false,
    value: target[key],
  });
  Object.defineProperty(target, key, {
    get(this: T): T[K] {
      return this[hiddenKey];
    },
    set(this: T, newValue: T[K]) {
      this[hiddenKey] = newValue;
      this.emit('updated');
    },
  });
};

import { useState } from 'react';
import { container } from '~/configs/inversify.config';

const cache: Map<any, any> = new Map();

export const useController = <C>(Controller: new (...args: any[]) => C, singleton = false): C => {
  const [ctrl] = useState(() => {
    if (singleton) {
      if (cache.has(Controller)) {
        return cache.get(Controller);
      } else {
        return cache.set(Controller, container.resolve(Controller)).get(Controller);
      }
    }

    return container.resolve(Controller);
  });

  return ctrl;
};

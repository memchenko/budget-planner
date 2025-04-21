import { useState } from 'react';
import { container } from '~/app/inversify.config';

export const useController = <C>(Controller: new (...args: any[]) => C): C => {
  const [ctrl] = useState(() => {
    return container.resolve(Controller);
  });

  return ctrl;
};

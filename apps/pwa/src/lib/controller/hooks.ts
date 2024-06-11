import React from 'react';

import type { IController, Props } from './types';

export const useController = <C extends IController>(controller: C | (new () => C), props: Props<C>): C => {
  const [ctrl] = React.useState<C>(() => {
    return typeof controller === 'function' ? new controller() : controller;
  });
  const [, update] = React.useState(0);

  React.useEffect(() => {
    ctrl.initialize();

    return ctrl.on('updated', () => {
      update((value) => value + 1);
    });
  }, []);

  React.useEffect(() => {
    Object.entries(props).forEach(([key, value]) => {
      ctrl[key as keyof C] = value as C[keyof C];
    });
  }, [props]);

  return ctrl;
};

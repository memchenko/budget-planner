import { PropsWithChildren } from 'react';

export const Hint = (props: PropsWithChildren) => {
  return <span className="text-l text-primary-900/50">{props.children}</span>;
};

import { HTMLAttributes } from 'react';

import './styles.module.css';

export const CardTitle = (props: HTMLAttributes<HTMLHeadingElement>) => {
  return <h1 {...props} className={`typography card-title ${props.className}`} />;
};

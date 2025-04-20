import { Button as BaseButton, ButtonProps } from '@nextui-org/button';
import cn from 'classnames';

export const Button = (props: ButtonProps) => {
  const { className, ...restProps } = props;

  return <BaseButton className={cn('typography text-xl', className)} size="lg" {...restProps} />;
};

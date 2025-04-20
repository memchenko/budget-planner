import { Button, ButtonProps } from '@nextui-org/button';
import cn from 'classnames';

export const SecondaryButton = (props: ButtonProps) => {
  const { className, ...restProps } = props;

  return <Button color="default" className={cn('typography text-xl', className)} size="lg" {...restProps} />;
};

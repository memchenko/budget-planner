import { Button, ButtonProps } from '@nextui-org/button';
import cn from 'classnames';

export const PrimaryButton = (props: ButtonProps) => {
  const { className, ...restProps } = props;

  return (
    <Button
      color="primary"
      className={cn('uppercase typography text-xl font-semibold', className)}
      size="lg"
      {...restProps}
    />
  );
};

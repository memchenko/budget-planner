import { Button, ButtonProps } from '@nextui-org/button';

export const DangerButton = (props: ButtonProps) => {
  return (
    <Button className="bg-danger uppercase typography text-xl font-semibold text-primary-50" size="lg" {...props} />
  );
};

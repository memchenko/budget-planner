import { Button, ButtonProps } from '@nextui-org/button';

export const PrimaryButton = (props: ButtonProps) => {
  return (
    <Button className="bg-primary uppercase typography text-xl font-semibold text-primary-50" size="lg" {...props} />
  );
};

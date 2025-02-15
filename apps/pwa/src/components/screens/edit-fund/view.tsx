import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@nextui-org/input';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Switch } from '~/components/ui/switch';
import { CardTitle } from '~/components/ui/card-title';
import { Hint } from '~/components/ui/hint';
import { PrimaryButton } from '~/components/ui/primary-button';
import { DangerButton } from '~/components/ui/danger-button';
import { EditFundController } from './controller';
import { useController } from '~/shared/hooks/useController';
import { z } from 'zod';
import { schema } from './schema';
import { DELETE_BUTTON_NAME, SUBMIT_BUTTON_NAME } from './constants';

export const EditFund = observer(() => {
  const ctrl = useController(EditFundController);
  const { handleSubmit, control } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: ctrl.initialValues,
  });

  return (
    <form onSubmit={handleSubmit(ctrl.handleSubmit)}>
      <div>
        <Card className="card">
          <CardHeader className="card-element">
            <CardTitle>Name</CardTitle>
          </CardHeader>
          <CardBody className="card-element">
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} autoFocus label="Name" size="lg" />}
            />
          </CardBody>
        </Card>
        <Card className="card">
          <CardHeader className="card-element">
            <CardTitle>Capacity</CardTitle>
          </CardHeader>
          <CardBody className="card-element">
            <Controller
              name="capacity"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                  label="Capacity"
                  placeholder="0.00"
                  size="lg"
                  value={String(value)}
                  onChange={(event) => {
                    onChange(parseFloat(event.target.value));
                  }}
                />
              )}
            />
          </CardBody>
        </Card>
        <Card className="card">
          <CardHeader className="card-element gap-1 items-start">
            <CardTitle>Initial Balance</CardTitle>
            <Hint>optional</Hint>
          </CardHeader>
          <CardBody className="card-element">
            <Controller
              name="balance"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                  label="Initial Balance"
                  placeholder="0.00"
                  size="lg"
                  value={String(value)}
                  onChange={(event) => {
                    onChange(parseFloat(event.target.value));
                  }}
                />
              )}
            />
          </CardBody>
        </Card>
        <Card className="card">
          <CardHeader className="card-element">
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardBody className="card-element flex flex-col gap-4">
            <Controller
              name="isCumulative"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Switch
                  {...field}
                  isSelected={value}
                  onChange={(event) => {
                    onChange(event.target.checked);
                  }}
                >
                  Cumulative
                </Switch>
              )}
            />
            <Controller
              name="takeDeficitFromWallet"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Switch
                  {...field}
                  isSelected={value}
                  onChange={(event) => {
                    onChange(event.target.checked);
                  }}
                >
                  Take deficit from wallet
                </Switch>
              )}
            />
            <Controller
              name="calculateDailyLimit"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Switch
                  {...field}
                  isSelected={value}
                  onChange={(event) => {
                    onChange(event.target.checked);
                  }}
                >
                  Calculate daily limit
                </Switch>
              )}
            />
          </CardBody>
        </Card>
        <div>
          {ctrl.users.map((user, index) => (
            <div key={index} onClick={ctrl.handleUserSelected.bind(ctrl, user.id)}>
              <img src={user.avatarSrc} alt="" width={25} height={25} />
              {user.firstName} {user.lastName}
            </div>
          ))}
        </div>

        <DangerButton type="submit" name={DELETE_BUTTON_NAME} className="flex-shrink-0">
          Delete this fund
        </DangerButton>
        <PrimaryButton type="submit" name={SUBMIT_BUTTON_NAME} className="flex-shrink-0">
          Submit
        </PrimaryButton>
      </div>
    </form>
  );
});

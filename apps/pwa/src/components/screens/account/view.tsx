import { observer } from 'mobx-react-lite';
import { Avatar } from '@nextui-org/avatar';
import { Input } from '@nextui-org/input';
import { Divider } from '@nextui-org/divider';
import { Button } from '~/components/ui/button';
import { PrimaryButton } from '~/components/ui/primary-button';
import { useController } from '~/shared/hooks/useController';
import { AccountController } from './controller';
import { Column } from '~/components/layouts/column';
import { TabPane } from '~/components/features/tab-pane';

export const Account = observer(() => {
  const ctrl = useController(AccountController);

  return (
    <Column>
      <label className="relative overflow-hidden">
        <Avatar size="lg" src={ctrl.avatarSrc} className="pointer-events-none" />
        <input type="file" className="absolute -top-1 -right-1 w-px h-px" onChange={ctrl.handleAvatarInputChange} />
      </label>
      <Input fullWidth size="lg" value={ctrl.name} onChange={ctrl.handleNameInputChange} />
      <PrimaryButton fullWidth onPress={ctrl.submitChanges}>
        Save
      </PrimaryButton>
      <Divider />
      <Button fullWidth onPress={ctrl.import}>
        Import
      </Button>
      <Button fullWidth onPress={ctrl.export}>
        Export
      </Button>
      <Button fullWidth onPress={ctrl.calculate}>
        Calculate
      </Button>
      <TabPane />
    </Column>
  );
});

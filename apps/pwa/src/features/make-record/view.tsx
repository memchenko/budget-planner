import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { observer } from 'mobx-react-lite';
import { PrimaryButton } from '../../lib/ui/primary-button';
import { Button } from '../../lib/ui/button';
import { useController } from '../../lib/hooks/useController';
import { TagsList } from '../tags-list';
import { getTitle } from './helpers';
import { MakeRecordController, State } from './controller';
import styles from './styles.module.css';

export interface MakeRecordProps {}

export const MakeRecord = observer((props: MakeRecordProps) => {
  const ctrl = useController(MakeRecordController);

  return (
    <div className={styles.makeRecord}>
      <Card isBlurred classNames={{ base: styles.card }}>
        {ctrl.state !== State.Idle && <CardHeader className="text-large uppercase">{getTitle(ctrl.state)}</CardHeader>}
        <CardBody>
          {ctrl.state === State.Idle && (
            <PrimaryButton className="text-foreground" onClick={ctrl.start}>
              Make record
            </PrimaryButton>
          )}
          {ctrl.state === State.TagsStep && <TagsList type="cost" />}
        </CardBody>
        {ctrl.state !== State.Idle && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="solid" className="flex-1" onClick={ctrl.reset}>
              Cancel
            </Button>
            <PrimaryButton className="flex-1" onClick={() => {}}>
              Next
            </PrimaryButton>
          </CardFooter>
        )}
      </Card>
    </div>
  );
});

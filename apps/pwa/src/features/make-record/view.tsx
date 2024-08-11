import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { observer } from 'mobx-react-lite';

import { PrimaryButton } from '../../lib/ui/primary-button';
import { useController } from '../../lib/hooks/useController';
import { TagsList } from '../tags-list';

import { MakeRecordController, State } from './controller';
import styles from './styles.module.css';

export interface MakeRecordProps {}

export const MakeRecord = observer((props: MakeRecordProps) => {
  const ctrl = useController(MakeRecordController);

  return (
    <div className={styles.makeRecord}>
      <Card isBlurred classNames={{ base: styles.card }}>
        <CardBody>
          {ctrl.state === State.Idle && (
            <PrimaryButton className="text-foreground" onClick={ctrl.start}>
              Make record
            </PrimaryButton>
          )}
          {ctrl.state === State.TagsStep && <TagsList type="cost" />}
        </CardBody>
        {ctrl.state !== State.Idle && (
          <CardFooter>
            <Button onClick={ctrl.reset}>Cancel</Button>
            <PrimaryButton onClick={() => {}}>Next</PrimaryButton>
          </CardFooter>
        )}
      </Card>
    </div>
  );
});

import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { observer } from 'mobx-react-lite';
import { PrimaryButton } from '../../lib/ui/primary-button';
import { Button } from '../../lib/ui/button';
import { useController } from '../../lib/hooks/useController';
import { TagsList } from './tags-list';
import { getTitle, shouldEnableNextButton, FormValues } from './helpers';
import { MakeRecordController, State } from './controller';
import styles from './styles.module.css';
import { useForm } from 'react-hook-form';
import { TypeOfRecord } from './type-of-record';
import { TAGS_LIST_PROPERTY_NAME, TYPE_OF_RECORD_PROPERTY_NAME } from './constants';

const defaultValues: FormValues = {
  [TAGS_LIST_PROPERTY_NAME]: [],
  [TYPE_OF_RECORD_PROPERTY_NAME]: 'cost',
};

export const MakeRecord = observer(() => {
  const ctrl = useController(MakeRecordController);
  const form = useForm<FormValues>({
    defaultValues,
  });
  const { setValue, getValues, watch, reset } = form;

  const typeOfRecord = getValues(TYPE_OF_RECORD_PROPERTY_NAME);
  const isNextButtonDisabled = !shouldEnableNextButton(ctrl.state, watch);

  const handleReset = () => {
    ctrl.reset();
    reset(defaultValues);
  };

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
          {ctrl.state === State.TagsStep && (
            <TagsList type={typeOfRecord} onChange={setValue.bind(form, TAGS_LIST_PROPERTY_NAME)} />
          )}
          {ctrl.state === State.TypeOfRecordStep && (
            <TypeOfRecord defaultValue={typeOfRecord} onChange={setValue.bind(form, TYPE_OF_RECORD_PROPERTY_NAME)} />
          )}
        </CardBody>
        {ctrl.state !== State.Idle && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="faded" className="flex-1" onClick={handleReset}>
              Cancel
            </Button>
            <PrimaryButton isDisabled={isNextButtonDisabled} className="flex-1" onClick={ctrl.next}>
              Next
            </PrimaryButton>
          </CardFooter>
        )}
      </Card>
    </div>
  );
});

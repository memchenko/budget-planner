import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { observer } from 'mobx-react-lite';
import { PrimaryButton } from '../../lib/ui/primary-button';
import { Button } from '../../lib/ui/button';
import { useController } from '../../lib/hooks/useController';
import { TagsList } from './tags-list';
import { getTitle, shouldEnableNextButton, FormValues, getNextButtonTitle, getSelectedKey } from './helpers';
import { MakeRecordController, State } from './controller';
import styles from './styles.module.css';
import { useForm, Controller } from 'react-hook-form';
import { TypeOfRecord } from './type-of-record';
import {
  TAGS_LIST_PROPERTY_NAME,
  TYPE_OF_RECORD_PROPERTY_NAME,
  AMOUNT_PROPERTY_NAME,
  FUND_PROPERTY_NAME,
} from './constants';
import { Input } from '@nextui-org/input';
import { FundsList } from './funds-list';
import { Accordion, AccordionItem } from '@nextui-org/accordion';

const defaultValues: FormValues = {
  [TAGS_LIST_PROPERTY_NAME]: [],
  [TYPE_OF_RECORD_PROPERTY_NAME]: 'cost',
  [AMOUNT_PROPERTY_NAME]: 0,
  [FUND_PROPERTY_NAME]: null,
};

export const MakeRecord = observer(() => {
  const ctrl = useController(MakeRecordController);
  const form = useForm<FormValues>({
    defaultValues,
  });
  const { setValue, getValues, watch, reset, control } = form;

  const typeOfRecord = getValues(TYPE_OF_RECORD_PROPERTY_NAME);
  const isNextButtonDisabled = !shouldEnableNextButton(ctrl.state, watch);
  const nextButtonTitle = getNextButtonTitle(ctrl.state);
  const shouldIncludeFundStep = watch(TYPE_OF_RECORD_PROPERTY_NAME) === 'cost';

  const handleReset = () => {
    ctrl.reset();
    reset(defaultValues);
  };

  const accordionItems = [
    <AccordionItem key="1" startContent="1." className={styles.itemContent} title={getTitle(State.TypeOfRecordStep)}>
      <TypeOfRecord defaultValue={typeOfRecord} onChange={setValue.bind(form, TYPE_OF_RECORD_PROPERTY_NAME)} />
    </AccordionItem>,
    <AccordionItem key="2" startContent="2." className={styles.itemContent} title={getTitle(State.AmountStep)}>
      <Controller
        name={AMOUNT_PROPERTY_NAME}
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <Input
            {...field}
            type="number"
            step="0.01"
            min="0"
            label="Amount"
            placeholder="0.00"
            size="lg"
            value={String(value)}
            onChange={(event) => {
              onChange(parseFloat(event.target.value));
            }}
          />
        )}
      />
    </AccordionItem>,
    <AccordionItem
      key="4"
      startContent={shouldIncludeFundStep ? '4.' : '3.'}
      className={styles.itemContent}
      title={getTitle(State.TagsStep)}
    >
      <TagsList type={typeOfRecord} onChange={setValue.bind(form, TAGS_LIST_PROPERTY_NAME)} />
    </AccordionItem>,
  ];

  if (shouldIncludeFundStep) {
    accordionItems.splice(
      2,
      0,
      <AccordionItem key="3" startContent="3." className={styles.itemContent} title={getTitle(State.FundStep)}>
        <FundsList onChange={setValue.bind(form, FUND_PROPERTY_NAME)} />
      </AccordionItem>,
    );
  }

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

          {ctrl.state !== State.Idle && (
            <Accordion selectedKeys={[getSelectedKey(ctrl.state)]} className="bg-background">
              {accordionItems}
            </Accordion>
          )}
        </CardBody>

        {ctrl.state !== State.Idle && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="faded" className="flex-1" onClick={handleReset}>
              Cancel
            </Button>
            <PrimaryButton
              isDisabled={isNextButtonDisabled}
              className="flex-1"
              onClick={ctrl.state === State.TagsStep ? ctrl.finish : ctrl.next}
            >
              {nextButtonTitle}
            </PrimaryButton>
          </CardFooter>
        )}
      </Card>
    </div>
  );
});

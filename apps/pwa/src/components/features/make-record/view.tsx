import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { observer } from 'mobx-react-lite';
import { PrimaryButton } from '~/components/ui/primary-button';
import { Button } from '~/components/ui/button';
import { useController } from '~/shared/hooks/useController';
import { TagsList } from './tags-list';
import { getTitle, getNextButtonTitle, getSelectedKey } from './helpers';
import { MakeRecordController } from './controller';
import styles from './styles.module.css';
import { TypeOfRecord } from './type-of-record';
import {
  TAGS_LIST_PROPERTY_NAME,
  TYPE_OF_RECORD_PROPERTY_NAME,
  AMOUNT_PROPERTY_NAME,
  FUND_PROPERTY_NAME,
  State,
  possibleSteps,
} from './constants';
import { Input } from '@nextui-org/input';
import { FundsList } from './funds-list';
import { Accordion, AccordionItem, AccordionProps } from '@nextui-org/accordion';
import cn from 'classnames';

export const MakeRecord = observer(() => {
  const ctrl = useController(MakeRecordController);

  const typeOfRecord = ctrl.values[TYPE_OF_RECORD_PROPERTY_NAME];
  const isNextButtonDisabled = !ctrl.shouldEnableNextButton;
  const nextButtonTitle = getNextButtonTitle(ctrl.state);
  const shouldIncludeFundStep = ctrl.values[TYPE_OF_RECORD_PROPERTY_NAME] === 'cost';

  const handleAccordionSelection: AccordionProps['onSelectionChange'] = (keys) => {
    if (keys === 'all') {
      return;
    }

    const key = Number(keys.values().next().value);

    if (possibleSteps.has(key)) {
      ctrl.forceStep(key);
    }
  };

  const accordionItems = [
    <AccordionItem
      key={State.TypeOfRecordStep}
      startContent="1."
      className={cn({ [styles.itemContent]: ctrl.state === State.TypeOfRecordStep })}
      title={getTitle(State.TypeOfRecordStep)}
    >
      <TypeOfRecord value={typeOfRecord} onChange={ctrl.setValue.bind(ctrl, TYPE_OF_RECORD_PROPERTY_NAME)} />
    </AccordionItem>,
    <AccordionItem
      key={State.AmountStep}
      startContent="2."
      className={cn({ [styles.itemContent]: ctrl.state === State.AmountStep })}
      title={getTitle(State.AmountStep)}
    >
      <Input
        autoFocus
        type="number"
        step="0.01"
        min="0"
        label="Amount"
        placeholder="0.00"
        size="lg"
        value={String(ctrl.values[AMOUNT_PROPERTY_NAME])}
        onChange={(event) => {
          ctrl.setValue(AMOUNT_PROPERTY_NAME, parseFloat(event.target.value));
        }}
      />
    </AccordionItem>,
    <AccordionItem
      key={State.TagsStep}
      startContent={shouldIncludeFundStep ? '4.' : '3.'}
      className={cn({ [styles.itemContent]: ctrl.state === State.TagsStep })}
      title={getTitle(State.TagsStep)}
    >
      <TagsList type={typeOfRecord} onChange={ctrl.setValue.bind(ctrl, TAGS_LIST_PROPERTY_NAME)} />
    </AccordionItem>,
  ];

  if (shouldIncludeFundStep) {
    accordionItems.splice(
      2,
      0,
      <AccordionItem
        key={State.FundStep}
        startContent="3."
        className={cn({ [styles.itemContent]: ctrl.state === State.FundStep })}
        title={getTitle(State.FundStep)}
      >
        <FundsList onChange={ctrl.setValue.bind(ctrl, FUND_PROPERTY_NAME)} />
      </AccordionItem>,
    );
  }

  return (
    <div className={styles.makeRecord}>
      <Card classNames={{ base: styles.card }}>
        {ctrl.state !== State.Idle && <CardHeader className="text-large uppercase">{getTitle(ctrl.state)}</CardHeader>}
        <CardBody>
          {ctrl.state === State.Idle && (
            <PrimaryButton className="text-foreground" onPress={ctrl.start}>
              Make record
            </PrimaryButton>
          )}

          {ctrl.state !== State.Idle && (
            <Accordion selectedKeys={[getSelectedKey(ctrl.state)]} onSelectionChange={handleAccordionSelection}>
              {accordionItems}
            </Accordion>
          )}
        </CardBody>

        {ctrl.state !== State.Idle && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="faded" className="flex-1" onPress={ctrl.reset}>
              Cancel
            </Button>
            <PrimaryButton
              isDisabled={isNextButtonDisabled}
              className="flex-1"
              onPress={ctrl.state === State.TagsStep ? ctrl.finish : ctrl.next}
            >
              {nextButtonTitle}
            </PrimaryButton>
          </CardFooter>
        )}
      </Card>
    </div>
  );
});

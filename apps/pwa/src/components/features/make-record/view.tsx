import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
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
  ACCOUNT_PROPERTY_NAME,
  State,
  possibleSteps,
} from './constants';
import { Input } from '@nextui-org/input';
import { AccountsList } from './accounts-list';
import { Accordion, AccordionItem, AccordionProps } from '@nextui-org/accordion';
import cn from 'classnames';

export type MakeRecordProps = {
  onFinish?: VoidFunction;
};

export const MakeRecord = observer((props: MakeRecordProps) => {
  const ctrl = useController(MakeRecordController);
  ctrl.onFinish = props.onFinish;
  const amountRef = useRef<HTMLInputElement>(null);

  const typeOfRecord = ctrl.values[TYPE_OF_RECORD_PROPERTY_NAME];
  const isNextButtonDisabled = !ctrl.shouldEnableNextButton;
  const nextButtonTitle = getNextButtonTitle(ctrl.state);
  const shouldExcludeFunds = ctrl.values[TYPE_OF_RECORD_PROPERTY_NAME] === 'income';

  const handleAccordionSelection: AccordionProps['onSelectionChange'] = (keys) => {
    if (keys === 'all') {
      return;
    }

    const key = Number(keys.values().next().value);

    if (possibleSteps.has(key)) {
      ctrl.forceStep(key);
    }
  };

  useEffect(() => {
    if (ctrl.state === State.AmountStep) {
      setTimeout(() => {
        amountRef.current?.focus();
      }, 0);
    }
  }, [ctrl.state]);

  return (
    <div className="w-full">
      <Card classNames={{ base: styles.card }}>
        <CardHeader className="text-large uppercase">{getTitle(ctrl.state)}</CardHeader>
        <CardBody>
          <Accordion selectedKeys={[getSelectedKey(ctrl.state)]} onSelectionChange={handleAccordionSelection}>
            <AccordionItem
              key={State.TypeOfRecordStep}
              startContent="1."
              className={cn({ [styles.itemContent]: ctrl.state === State.TypeOfRecordStep })}
              title={getTitle(State.TypeOfRecordStep)}
            >
              <TypeOfRecord value={typeOfRecord} onChange={ctrl.setValue.bind(ctrl, TYPE_OF_RECORD_PROPERTY_NAME)} />
            </AccordionItem>
            <AccordionItem
              key={State.AmountStep}
              startContent="2."
              className={cn({ [styles.itemContent]: ctrl.state === State.AmountStep })}
              title={getTitle(State.AmountStep)}
            >
              <Input
                autoFocus
                ref={amountRef}
                enterKeyHint="enter"
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
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    ctrl.next();
                  }
                }}
              />
            </AccordionItem>
            <AccordionItem
              key={State.AccountStep}
              startContent="3."
              className={cn({ [styles.itemContent]: ctrl.state === State.AccountStep })}
              title={getTitle(State.AccountStep)}
            >
              <AccountsList
                excludeFunds={shouldExcludeFunds}
                onChange={ctrl.setValue.bind(ctrl, ACCOUNT_PROPERTY_NAME)}
              />
            </AccordionItem>
            <AccordionItem
              key={State.TagsStep}
              startContent="4."
              className={cn({ [styles.itemContent]: ctrl.state === State.TagsStep })}
              title={getTitle(State.TagsStep)}
            >
              <TagsList
                type={typeOfRecord}
                parentType={ctrl.values.account.accountType}
                parentId={ctrl.values.account.id}
                onChange={ctrl.setValue.bind(ctrl, TAGS_LIST_PROPERTY_NAME)}
              />
            </AccordionItem>
          </Accordion>
        </CardBody>

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
      </Card>
    </div>
  );
});

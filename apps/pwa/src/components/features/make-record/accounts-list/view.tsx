import { observer } from 'mobx-react-lite';
import { AccountsListController } from './controller';
import { useController } from '~/shared/hooks/useController';
import { RadioGroup, Radio } from '@nextui-org/radio';
import styles from './styles.module.css';
import { t } from '~/shared/translations';

export interface AccountsListProps {
  excludeFunds: boolean;
  onChange: AccountsListController['onChange'];
}

export const AccountsList = observer((props: AccountsListProps) => {
  const ctrl = useController(AccountsListController);
  ctrl.onChange = props.onChange;

  return (
    <RadioGroup onChange={({ nativeEvent }) => ctrl.handleRadioChange(nativeEvent)}>
      {!props.excludeFunds && (
        <>
          <h4 className="text-foreground-400">Funds</h4>
          <div className={styles.list}>
            {ctrl.allFunds.map(({ id, title }) => (
              <Radio key={id} value={`fund/${id}`} size="lg" color="primary">
                {title}
              </Radio>
            ))}
          </div>
        </>
      )}
      <h4 className="text-foreground-400">{t('Wallets')}</h4>
      <div className={styles.list}>
        {ctrl.allWallets.map(({ id, title }) => (
          <Radio key={id} value={`wallet/${id}`} size="lg" color="primary">
            {title}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
});

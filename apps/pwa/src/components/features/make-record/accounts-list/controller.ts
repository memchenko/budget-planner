import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { TOKENS } from '~/shared/constants/di';
import * as fund from '~/stores/fund';
import * as wallet from '~/stores/wallet';
import { fund as fundEntityName, wallet as walletEntityName } from '#/libs/core/shared/schemas';
import get from 'lodash/get';

type AccountType = typeof fundEntityName | typeof walletEntityName;

@provide(AccountsListController)
export class AccountsListController {
  constructor(
    @inject(TOKENS.FUND_STORE) private readonly fund: fund.Fund,
    @inject(TOKENS.WALLET_STORE) private readonly wallet: wallet.Wallet,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  onChange!: (value: { id: string; accountType: AccountType }) => void;

  get allWallets() {
    return this.wallet.all.map(({ id, title }) => ({
      id,
      title,
    }));
  }

  get allFunds() {
    return this.fund.all.map(({ id, title }) => ({
      id,
      title,
    }));
  }

  handleRadioChange(event: Event) {
    const isInputElement = event.currentTarget instanceof HTMLInputElement;
    const valueAttr = get(event.currentTarget, 'value', null);
    const accountTypeAttr = get(event.currentTarget, 'data-account-type', null);

    if (
      !isInputElement ||
      typeof valueAttr !== 'string' ||
      ![fundEntityName, walletEntityName].includes(accountTypeAttr as unknown as AccountType)
    ) {
      return;
    }

    this.onChange({
      id: valueAttr,
      accountType: accountTypeAttr as unknown as AccountType,
    });
  }
}

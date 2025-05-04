import { inject, injectable } from 'inversify';

import { Repo } from 'core/shared/types';
import { Fund } from 'core/entities/Fund';
import { Wallet } from 'core/entities/Wallet';
import { TOKENS } from 'core/types';
import { BaseScenario } from 'core/scenarios/BaseScenario';

export type CalculateFundsParams = { userId: string } & Record<
  | 'currentBalance'
  | 'income'
  | 'rent'
  | 'water'
  | 'gas'
  | 'electricity'
  | 'homeFees'
  | 'transport'
  | 'mobile'
  | 'internet'
  | 'loans'
  | 'food'
  | 'pets'
  | 'personalCare'
  | 'householdSupplies'
  | 'entertainmentSubscriptions'
  | 'sportsSubscriptions'
  | 'diningOut'
  | 'entertainment'
  | 'travel'
  | 'currentRent'
  | 'currentWater'
  | 'currentGas'
  | 'currentElectricity'
  | 'currentHomeFees'
  | 'currentTransport'
  | 'currentLoans'
  | 'currentMobile'
  | 'currentInternet',
  number
>;

@injectable()
export class CalculateFunds extends BaseScenario<
  CalculateFundsParams,
  {
    capacityOverflow: number;
  }
> {
  constructor(
    @inject(TOKENS.FUND_REPO)
    private fundRepo: Repo<Fund, 'id'>,
    @inject(TOKENS.WALLET_REPO)
    private walletRepo: Repo<Wallet, 'id'>,
  ) {
    super();
  }

  async execute() {
    const daysPassedSinceTheBeginningOfTheMonth = new Date().getDate();
    const numberOfDaysInTheMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const monthProgress = daysPassedSinceTheBeginningOfTheMonth / numberOfDaysInTheMonth;

    // Money
    let { currentBalance } = this.params;
    const { income } = this.params;

    // Necessary
    const { rent, water, gas, electricity, homeFees, transport, mobile, internet, loans } = this.params;
    const appliedNecessaryEntries = Object.entries({
      rent,
      water,
      gas,
      electricity,
      homeFees,
      transport,
      mobile,
      internet,
      loans,
    }).filter((entry) => entry[1] > -1);
    const necessaryFundSize = Math.ceil(appliedNecessaryEntries.reduce((acc, entry) => acc + entry[1], 100));

    // Current necessary spendings
    const {
      currentRent,
      currentWater,
      currentGas,
      currentElectricity,
      currentHomeFees,
      currentTransport,
      currentLoans,
      currentMobile,
      currentInternet,
    } = this.params;

    const currentNecessaryFundSpendings = Object.entries({
      currentRent,
      currentWater,
      currentGas,
      currentElectricity,
      currentHomeFees,
      currentTransport,
      currentLoans,
      currentMobile,
      currentInternet,
    })
      .filter((entry) => entry[1] > -1)
      .reduce((acc, entry) => acc + entry[1], 0);
    const necessaryFundInitialBalance = Math.floor(necessaryFundSize - currentNecessaryFundSpendings);

    currentBalance = Math.max(currentBalance - necessaryFundInitialBalance, 0);

    // Groceries
    const { food, pets, personalCare, householdSupplies } = this.params;
    const appliedGroceriesEntries = Object.entries({
      food,
      pets,
      personalCare,
      householdSupplies,
    }).filter((entry) => entry[1] > -1);
    const groceriesFundSize = Math.ceil(appliedGroceriesEntries.reduce((acc, entry) => acc + entry[1], 100));

    let groceriesFundInitialBalance = groceriesFundSize - Math.floor(groceriesFundSize * monthProgress);

    if (groceriesFundInitialBalance > currentBalance) {
      groceriesFundInitialBalance = currentBalance;
    }

    currentBalance -= groceriesFundInitialBalance;

    // Leisure
    const { entertainmentSubscriptions, sportsSubscriptions, diningOut, entertainment, travel } = this.params;
    const appliedLeisureEntries = Object.entries({
      entertainmentSubscriptions,
      sportsSubscriptions,
      diningOut,
      entertainment,
      travel,
    }).filter((entry) => entry[1] > -1);
    const leisureFundSize = Math.ceil(appliedLeisureEntries.reduce((acc, entry) => acc + entry[1], 0));
    let leisureFundInitialBalance = leisureFundSize - Math.floor(leisureFundSize * monthProgress);

    if (leisureFundInitialBalance > currentBalance) {
      leisureFundInitialBalance = currentBalance;
    }

    currentBalance -= leisureFundInitialBalance;

    const wallet = (await this.walletRepo.getAll())[0];

    await this.walletRepo.updateOneBy(
      { id: wallet.id },
      {
        balance: currentBalance,
      },
    );

    await this.fundRepo.create({
      userId: this.params.userId,
      title: 'Обязательное',
      balance: necessaryFundInitialBalance,
      priority: 1,
      capacity: necessaryFundSize,
      isCumulative: false,
      isEager: true,
      calculateDailyLimit: false,
      externalWalletId: null,
    });

    await this.fundRepo.create({
      userId: this.params.userId,
      title: 'Продовольствие',
      balance: groceriesFundInitialBalance,
      priority: 2,
      capacity: groceriesFundSize,
      isCumulative: false,
      isEager: true,
      calculateDailyLimit: true,
      externalWalletId: null,
    });

    await this.fundRepo.create({
      userId: this.params.userId,
      title: 'Досуг',
      balance: leisureFundInitialBalance,
      priority: 3,
      capacity: leisureFundSize,
      isCumulative: true,
      isEager: false,
      calculateDailyLimit: false,
      externalWalletId: null,
    });

    return {
      capacityOverflow: income - necessaryFundSize - groceriesFundSize - leisureFundSize,
    };
  }

  async revert() {}
}

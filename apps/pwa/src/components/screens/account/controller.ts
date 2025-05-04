import React from 'react';
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { makeAutoObservable } from 'mobx';
import omit from 'lodash/omit';
import { TOKENS } from '~/shared/constants/di';
import { ScenarioRunner } from '~/shared/impl/scenario-runner';
import * as userStore from '~/stores/user';
import * as walletStore from '~/stores/wallet';
import * as fundsStore from '~/stores/fund';
import * as incomeStore from '~/stores/income';
import * as costStore from '~/stores/cost';
import * as tagStore from '~/stores/tag';
import * as sharingRuleStore from '~/stores/sharing-rule';
import * as synchronizationOrderStore from '~/stores/synchronization-order';
import { NotificationShowEvent } from '~/shared/events';

@provide(AccountController)
export class AccountController {
  newAvatarSrc: string | null = null;
  newName: string | null = null;

  isCalculating = false;
  isImporting = false;
  isExporting = false;

  get avatarSrc() {
    return this.newAvatarSrc ?? this.userStore.current?.avatarSrc ?? '';
  }

  get name() {
    return this.newName ?? this.userStore.current?.firstName ?? '';
  }

  constructor(
    @inject(TOKENS.SCENARIO_RUNNER)
    private readonly scenarioRunner: ScenarioRunner,
    @inject(TOKENS.USER_STORE)
    private readonly userStore: userStore.User,
    @inject(TOKENS.WALLET_STORE)
    private readonly walletStore: walletStore.Wallet,
    @inject(TOKENS.FUND_STORE)
    private readonly fundStore: fundsStore.Fund,
    @inject(TOKENS.INCOME_STORE)
    private readonly incomeStore: incomeStore.Income,
    @inject(TOKENS.COST_STORE)
    private readonly costStore: costStore.Cost,
    @inject(TOKENS.TAG_STORE)
    private readonly tagStore: tagStore.Tag,
    @inject(TOKENS.SHARING_RULE_STORE)
    private readonly sharingRuleStore: sharingRuleStore.SharingRule,
    @inject(TOKENS.SYNCHRONIZATION_ORDER_STORE)
    private readonly synchronizationOrderStore: synchronizationOrderStore.SynchronizationOrder,
    @inject(TOKENS.EVENTS.NOTIFICATION_SHOW)
    private readonly notificationShowEvent: NotificationShowEvent,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async export() {
    this.isExporting = true;

    const userId = this.userStore.current.id;

    const data = {
      user: this.userStore.entries.map((entry) => ({ ...omit(entry, 'avatarSrc'), avatarSrc: '' })),
      wallet: this.walletStore.entries.map((entry) => ({
        ...entry,
        userId: entry.userId === userId ? null : entry.userId,
      })),
      fund: this.fundStore.entries.map((entry) => ({
        ...entry,
        userId: entry.userId === userId ? null : entry.userId,
      })),
      income: this.incomeStore.entries.map((entry) => ({
        ...entry,
        userId: entry.userId === userId ? null : entry.userId,
      })),
      cost: this.costStore.entries.map((entry) => ({
        ...entry,
        userId: entry.userId === userId ? null : entry.userId,
      })),
      tag: this.tagStore.entries.map((entry) => ({
        ...entry,
        userId: entry.userId === userId ? null : entry.userId,
      })),
      sharingRule: this.sharingRuleStore.entries.map((entry) => ({
        ...entry,
        ownerId: entry.ownerId === userId ? null : entry.ownerId,
      })),
      synchronizationOrder: this.synchronizationOrderStore.entries,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    // eslint-disable-next-line
    // @ts-ignore
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'budget-tracker.json',
      types: [
        {
          description: 'JSON File',
          accept: { 'application/json': ['.json'] },
        },
      ],
    });

    const writableStream = await fileHandle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();

    this.notificationShowEvent.push({
      type: 'success',
      message: 'Data successfully exported',
    });

    this.isExporting = false;
  }

  async import() {
    this.isImporting = true;

    // eslint-disable-next-line
    // @ts-ignore
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'JSON File',
          accept: { 'application/json': ['.json'] },
        },
      ],
    });

    const file = await fileHandle.getFile();
    const content = await file.text();
    const data = JSON.parse(content);
    const currentUserId = this.userStore.current.id;
    if (data.wallet) {
      this.walletStore.entries = data.wallet.map((wallet: walletStore.EntityType) => ({
        ...wallet,
        userId: wallet.userId === null ? currentUserId : wallet.userId,
      }));
    }

    if (data.fund) {
      this.fundStore.entries = data.fund.map((fund: fundsStore.EntityType) => ({
        ...fund,
        userId: fund.userId === null ? currentUserId : fund.userId,
      }));
    }

    if (data.income) {
      this.incomeStore.entries = data.income.map((income: incomeStore.EntityType) => ({
        ...income,
        userId: income.userId === null ? currentUserId : income.userId,
      }));
    }

    if (data.cost) {
      this.costStore.entries = data.cost.map((cost: costStore.EntityType) => ({
        ...cost,
        userId: cost.userId === null ? currentUserId : cost.userId,
      }));
    }

    if (data.tag) {
      this.tagStore.entries = data.tag.map((tag: tagStore.EntityType) => ({
        ...tag,
        userId: tag.userId === null ? currentUserId : tag.userId,
      }));
    }

    if (data.sharingRule) {
      this.sharingRuleStore.entries = data.sharingRule.map((rule: sharingRuleStore.EntityType) => ({
        ...rule,
        userId: rule.userId === null ? currentUserId : rule.userId,
        ownerId: rule.ownerId === null ? currentUserId : rule.ownerId,
      }));
    }

    if (data.synchronizationOrder) {
      this.synchronizationOrderStore.entries = data.synchronizationOrder;
    }

    this.notificationShowEvent.push({
      type: 'success',
      message: 'Data successfully imported',
    });

    this.isImporting = false;
  }

  handleNameInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.newName = event.target.value;
  }

  handleAvatarInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.newAvatarSrc = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async submitChanges() {
    const payload: Partial<Omit<userStore.EntityType, 'createdAt' | 'updatedAt'>> = {
      id: this.userStore.current.id,
    };

    if (this.newAvatarSrc) {
      payload.avatarSrc = this.newAvatarSrc;
    }

    if (this.newName) {
      payload.firstName = this.newName;
    }

    await this.scenarioRunner.execute({
      scenario: 'UpdateUser',
      payload,
    });

    this.notificationShowEvent.push({
      type: 'success',
      message: 'User successfully updated',
    });

    this.newAvatarSrc = null;
    this.newName = null;
  }

  async calculate() {
    this.isCalculating = true;

    const numberDecoder = (v: string | null) => {
      if (v === null || v === undefined || v === '') return -1;

      const res = parseFloat(v);
      if (res < 0 || Number.isNaN(res)) throw new Error();
      return res;
    };

    try {
      const currentBalance = this.getInputSafe({
        message: 'How much money do you have on your bank account right now?',
        errorMessage: 'Bank account balance must be a positive number or 0',
        decoder: numberDecoder,
      });

      const income = this.getInputSafe({
        message: "What's your regular monthly income?",
        errorMessage: 'Regular monthly income must be a positive number or 0',
        decoder: numberDecoder,
      });
      // Necessary
      const rent = this.getInputSafe({
        message: 'How much do you pay for rent monthly?',
        errorMessage: 'Monthly rent must be a positive number or 0',
        decoder: numberDecoder,
      });
      const water = this.getInputSafe({
        message: 'How much do you pay for water monthly?',
        errorMessage: 'Monthly water bill must be a positive number or 0',
        decoder: numberDecoder,
      });
      const gas = this.getInputSafe({
        message: 'How much do you pay for gas monthly?',
        errorMessage: 'Monthly gas bill must be a positive number or 0',
        decoder: numberDecoder,
      });
      const electricity = this.getInputSafe({
        message: 'How much do you pay for electricity monthly?',
        errorMessage: 'Monthly electricity bill must be a positive number or 0',
        decoder: numberDecoder,
      });
      const homeFees = this.getInputSafe({
        message: 'How much do you spend on other necessary home fees monthly?',
        errorMessage: 'Other monthly home fees must be a positive number or 0',
        decoder: numberDecoder,
      });
      const transport = this.getInputSafe({
        message: 'How much do you spend for transport monthly?',
        errorMessage: 'Monthly transport spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const mobile = this.getInputSafe({
        message: 'How much do you spend for mobile services monthly?',
        errorMessage: 'Monthly mobile spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const internet = this.getInputSafe({
        message: 'How much do you spend for internet services monthly?',
        errorMessage: 'Monthly internet spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const loans = this.getInputSafe({
        message: 'How much do you spend for loans monthly?',
        errorMessage: 'Monthly loan payments must be a positive number or 0',
        decoder: numberDecoder,
      });
      // Groceries
      const food = this.getInputSafe({
        message: 'How much do you spend for food and groceries monthly?',
        errorMessage: 'Monthly food spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const pets = this.getInputSafe({
        message: 'How much do you spend for pet supplies monthly?',
        errorMessage: 'Monthly pet spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const personalCare = this.getInputSafe({
        message: 'How much do you spend for personal care monthly?',
        errorMessage: 'Monthly personal care spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const householdSupplies = this.getInputSafe({
        message: 'How much do you spend for household supplies monthly?',
        errorMessage: 'Monthly household supplies spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      // Leisure
      const entertainmentSubscriptions = this.getInputSafe({
        message: 'How much do you spend for entertainment subscriptions monthly?',
        errorMessage: 'Monthly entertainment subscriptions must be a positive number or 0',
        decoder: numberDecoder,
      });
      const sportsSubscriptions = this.getInputSafe({
        message: 'How much do you spend for sports subscriptions monthly?',
        errorMessage: 'Monthly sports subscriptions must be a positive number or 0',
        decoder: numberDecoder,
      });
      const diningOut = this.getInputSafe({
        message: 'How much do you spend for dining out monthly?',
        errorMessage: 'Monthly dining out spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const entertainment = this.getInputSafe({
        message: 'How much do you spend for entertainment monthly?',
        errorMessage: 'Monthly entertainment spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const travel = this.getInputSafe({
        message: 'How much do you spend for travel monthly?',
        errorMessage: 'Monthly travel spendings must be a positive number or 0',
        decoder: numberDecoder,
      });

      const currentRent = this.getInputSafe({
        message: 'How much have you spent for rent in this month?',
        errorMessage: 'Rent spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const currentWater = this.getInputSafe({
        message: 'How much have you spent for water in this month?',
        errorMessage: 'Water spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const currentGas = this.getInputSafe({
        message: 'How much have you spent for gas in this month?',
        errorMessage: 'Gas spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const currentElectricity = this.getInputSafe({
        message: 'How much have you spent for electricity in this month?',
        errorMessage: 'Electricity spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const currentHomeFees = this.getInputSafe({
        message: 'How much have you spent for other home fees in this month?',
        errorMessage: 'Home fees must be a positive number or 0',
        decoder: numberDecoder,
      });
      const currentTransport = this.getInputSafe({
        message: 'How much have you spent for transport in this month?',
        errorMessage: 'Transport spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const currentLoans = this.getInputSafe({
        message: 'How much have you spent for loans in this month?',
        errorMessage: 'Loan payments must be a positive number or 0',
        decoder: numberDecoder,
      });
      const currentMobile = this.getInputSafe({
        message: 'How much have you spent for mobile services in this month?',
        errorMessage: 'Mobile spendings must be a positive number or 0',
        decoder: numberDecoder,
      });
      const currentInternet = this.getInputSafe({
        message: 'How much have you spent for internet services in this month?',
        errorMessage: 'Internet spendings must be a positive number or 0',
        decoder: numberDecoder,
      });

      const res = (await this.scenarioRunner.execute({
        scenario: 'CalculateFunds',
        payload: {
          userId: this.userStore.current.id,
          currentBalance,
          income,
          rent,
          water,
          gas,
          electricity,
          homeFees,
          transport,
          mobile,
          internet,
          loans,
          food,
          pets,
          personalCare,
          householdSupplies,
          entertainmentSubscriptions,
          sportsSubscriptions,
          diningOut,
          entertainment,
          travel,
          currentRent,
          currentWater,
          currentGas,
          currentElectricity,
          currentHomeFees,
          currentTransport,
          currentLoans,
          currentMobile,
          currentInternet,
        },
      })) as unknown as { capacityOverflow: number };

      this.notificationShowEvent.push({
        type: 'success',
        message: 'The funds are sucessfully calculated. Open main screen to check',
      });

      if (res.capacityOverflow < 0) {
        this.notificationShowEvent.push({
          type: 'warning',
          message: "You're income doesn't cover your spendings!",
        });
      }
    } catch {
      this.notificationShowEvent.push({
        type: 'error',
        message: "Couldn't calculate budgets",
      });
    } finally {
      this.isCalculating = false;
    }
  }

  private getInputSafe<T>(params: { message: string; errorMessage: string; decoder: (v: string | null) => T }) {
    try {
      return params.decoder(
        window.prompt(
          `${params.message} (Don't type anything in the input if the questions doesn't apply to you and just click "confirm")`,
        ),
      );
    } catch (err) {
      this.notificationShowEvent.push({
        type: 'error',
        message: params.errorMessage,
      });
      throw err;
    }
  }
}

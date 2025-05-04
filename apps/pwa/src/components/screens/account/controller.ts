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
    const userId = this.userStore.current.id;

    const data = {
      user: this.userStore.entries.map((entry) => omit(entry, 'avatarSrc')),
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
  }

  async import() {
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
}

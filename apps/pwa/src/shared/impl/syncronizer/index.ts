import { injectable, inject } from 'inversify';
import { TOKENS } from '~/shared/constants/di';
import { WebRTC } from '~/shared/impl/webrtc';
import { User } from '~/entities/user';
import { Fund } from '~/entities/fund';
import { Wallet } from '~/entities/wallet';
import { Cost } from '~/entities/cost';
import { Income } from '~/entities/income';
import { Tag } from '~/entities/tag';
import { Dictionaries } from '~/entities/dictionaries';
import { SynchronizationOrder } from '~/entities/synchronization-order';
import {
  WebRTCMessage,
  greetEventTypeSchema,
  GreetMessage,
  newRecordEventTypeSchema,
  NewRecordMessage,
  fundRecordSchema,
  costRecordSchema,
  costTagRecordSchema,
  incomeRecordSchema,
  incomeTagRecordSchema,
  tagRecordSchema,
  walletRecordSchema,
  confirmEventTypeSchema,
  ConfirmMessage,
} from '~/shared/schemas/webrtc';
import { fund, cost, income } from '#/libs/core/shared/schemas';
import { assert } from 'ts-essentials';

@injectable()
export class Synchronizer {
  private isInitiator = false;

  constructor(
    @inject(TOKENS.WEB_RTC) private readonly webrtc: WebRTC<WebRTCMessage>,
    @inject(TOKENS.USER_STORE) private readonly user: User,
    @inject(TOKENS.FUND_STORE) private readonly fund: Fund,
    @inject(TOKENS.WALLET_STORE) private readonly wallet: Wallet,
    @inject(TOKENS.INCOME_STORE) private readonly income: Income,
    @inject(TOKENS.COST_STORE) private readonly cost: Cost,
    @inject(TOKENS.TAG_STORE) private readonly tag: Tag,
    @inject(TOKENS.DICTIONARY_STORE) private readonly dictionaries: Dictionaries,
    @inject(TOKENS.SYNCHRONIZATION_ORDER_STORE) private readonly synchronizationOrder: SynchronizationOrder,
  ) {
    this.webrtc.on('message', this.handleMessage.bind(this));
  }

  initiate() {
    this.isInitiator = true;
    this.sendGreeting();
  }

  private handleMessage(message: WebRTCMessage) {
    alert(JSON.stringify(message, null, 2));
    switch (message.type) {
      case greetEventTypeSchema.value: {
        return this.handleGreet(message);
      }
      case newRecordEventTypeSchema.value: {
        return this.handleNewRecord(message);
      }
      case confirmEventTypeSchema.value: {
        return this.handleConfirm(message);
      }
    }
  }

  private handleGreet(message: GreetMessage) {
    this.user.upsert(message.payload.value);

    if (!this.isInitiator) {
      this.sendGreeting();
    }

    this.synchronizationOrder.getAllByUserId(message.payload.value.id).forEach((order) => {
      if (order.action === 'create') {
        switch (order.entity) {
          case fund: {
            const value = this.fund.getFund(order.entityId);

            assert(value, '');

            return this.webrtc.sendMessage({
              orderId: order.id,
              type: newRecordEventTypeSchema.value,
              payload: {
                entity: fund,
                value,
              },
            });
          }
          case cost: {
            const value = this.cost.getCost(order.entityId);

            assert(value, '');

            return this.webrtc.sendMessage({
              orderId: order.id,
              type: newRecordEventTypeSchema.value,
              payload: {
                entity: cost,
                value,
              },
            });
          }
          case income: {
            const value = this.income.getIncome(order.entityId);

            assert(value, '');

            return this.webrtc.sendMessage({
              orderId: order.id,
              type: newRecordEventTypeSchema.value,
              payload: {
                entity: income,
                value,
              },
            });
          }
        }
      }
    });
  }

  private sendGreeting() {
    this.webrtc.sendMessage({
      type: greetEventTypeSchema.value,
      payload: {
        entity: 'user',
        value: this.user.current,
      },
    });
  }

  private handleNewRecord(message: NewRecordMessage) {
    switch (message.payload.entity) {
      case walletRecordSchema.shape.entity.value: {
        this.wallet.add(message.payload.value);
        break;
      }
      case fundRecordSchema.shape.entity.value: {
        this.fund.add(message.payload.value);
        break;
      }
      case incomeRecordSchema.shape.entity.value: {
        this.income.add(message.payload.value);
        break;
      }
      case costRecordSchema.shape.entity.value: {
        this.cost.add(message.payload.value);
        break;
      }
      case tagRecordSchema.shape.entity.value: {
        this.tag.add(message.payload.value);
        break;
      }
      case costTagRecordSchema.shape.entity.value: {
        this.dictionaries.addCategory({
          id: message.payload.value.costId,
          type: 'cost',
          tagId: message.payload.value.tagId,
        });
        break;
      }
      case incomeTagRecordSchema.shape.entity.value: {
        this.dictionaries.addCategory({
          id: message.payload.value.incomeId,
          type: 'income',
          tagId: message.payload.value.tagId,
        });
        break;
      }
    }

    if (message.orderId) {
      this.webrtc.sendMessage({
        type: confirmEventTypeSchema.value,
        orderId: message.orderId,
      });
    }
  }

  handleConfirm(message: ConfirmMessage) {
    if (message.orderId) {
      this.synchronizationOrder.remove(message.orderId);
    }
  }
}

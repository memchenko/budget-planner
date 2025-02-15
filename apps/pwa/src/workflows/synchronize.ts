import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TOKENS } from '~/shared/constants/di';
import { Repo } from 'core/shared/types';
import {
  Wallet,
  Fund,
  Tag,
  Cost,
  Income,
  SynchronizationOrder,
  synchronizationOrderSchema,
  entitySchemaMap,
  EntityMap,
} from 'core/entities';
import { allEntities, fund, wallet, tag, income, cost } from 'core/shared/schemas';
import { assert } from 'ts-essentials';
import { hasProperty, matchesSchema } from '~/shared/type-guards';
import {
  PEER_EVENTS,
  IConnection,
  WORKFLOW_TOKENS,
  ICooperativeWorkflow,
  LOCAL_EVENTS,
  IEventBus,
  INotification,
  IPrompt,
} from './types';
import { z } from 'zod';
import { entityAcceptedSchema } from './schemas';
import capitalize from 'lodash/capitalize';
import { reaction } from 'mobx';
import * as syncronizationOrder from '~/stores/synchronization-order';
import { Subject, fromEventPattern, lastValueFrom } from 'rxjs';
import { distinct, mergeMap, takeUntil, tap } from 'rxjs/operators';

const messageSchema = z.object({
  needConfirmation: z.boolean(),
  entityType: allEntities.extract([fund, wallet, tag, income, cost]),
  value: z.object({
    id: z.string(),
  }),
  operation: synchronizationOrderSchema.shape.action,
});

@provide(Synchronizer)
export class Synchronizer implements ICooperativeWorkflow {
  private queue = new Subject<SynchronizationOrder>();
  private entityRepoMap: {
    fund: Repo<Fund>;
    wallet: Repo<Wallet>;
    tag: Repo<Tag>;
    cost: Repo<Cost>;
    income: Repo<Income>;
  };

  constructor(
    @inject(WORKFLOW_TOKENS.IConnection) private readonly peer: IConnection,
    @inject(TOKENS.FUND_REPO) private readonly fund: Repo<Fund>,
    @inject(TOKENS.WALLET_REPO) private readonly wallet: Repo<Wallet>,
    @inject(TOKENS.INCOME_REPO) private readonly income: Repo<Income>,
    @inject(TOKENS.COST_REPO) private readonly cost: Repo<Cost>,
    @inject(TOKENS.TAG_REPO) private readonly tag: Repo<Tag>,
    @inject(TOKENS.SYNCHRONIZATION_ORDER_REPO) private readonly synchronizationOrder: Repo<SynchronizationOrder>,
    @inject(WORKFLOW_TOKENS.IEventBus) private readonly eventBus: IEventBus,
    @inject(WORKFLOW_TOKENS.INotification) private readonly notification: INotification,
    @inject(WORKFLOW_TOKENS.IPrompt) private readonly prompt: IPrompt,
    @inject(TOKENS.SYNCHRONIZATION_ORDER_STORE)
    private readonly synchronizationOrderStore: syncronizationOrder.SynchronizationOrder,
  ) {
    this.handleOrder = this.handleOrder.bind(this);

    this.entityRepoMap = {
      fund: this.fund,
      wallet: this.wallet,
      tag: this.tag,
      cost: this.cost,
      income: this.income,
    };

    this.eventBus.listen(LOCAL_EVENTS.GREETED_PEER, this.execute.bind(this));
    this.peer.listen(PEER_EVENTS.SYNC_ENTITY, this.answer.bind(this));
  }

  async answer(message: unknown) {
    assert(matchesSchema(message, messageSchema), 'Invalid message format');

    const entityTypeTitle = capitalize(message.entityType);

    if (message.operation === 'create') {
      if (message.needConfirmation) {
        let description = `The peer shared ${entityTypeTitle}`;

        if (matchesSchema(message.value, z.object({ title: z.string() }))) {
          description += ` named "${message.value.title}"`;
        }

        description += ' with you';

        const shouldAccept = await this.prompt.question('Do you accept new resource from the peer?', description);

        if (!shouldAccept) {
          this.notification.error(`You refused to accept shared ${entityTypeTitle}`);
          this.peer.send(
            PEER_EVENTS.ENTITY_ACCEPTED,
            this.buildAcceptAnswer(message.entityType, message.value.id, false),
          );
          return;
        }
      }

      assert(matchesSchema(message.value, entitySchemaMap[message.entityType]));

      const repo = this.entityRepoMap[message.entityType];
      await (repo.create as Repo<EntityMap[typeof message.entityType]>['create'])(message.value);

      if (message.needConfirmation) {
        this.notification.success(`You accepted shared ${entityTypeTitle}`);
      }

      this.peer.send(PEER_EVENTS.ENTITY_ACCEPTED, this.buildAcceptAnswer(message.entityType, message.value.id, true));
    }

    if (message.operation === 'update') {
      const repo = this.entityRepoMap[message.entityType];
      await repo.updateOneBy({ id: message.value.id }, message.value);
      this.peer.send(PEER_EVENTS.ENTITY_ACCEPTED, this.buildAcceptAnswer(message.entityType, message.value.id, false));
      return;
    }
  }

  async execute(peerUserId: unknown) {
    assert(typeof peerUserId === 'string', 'Invalid peer userId');

    this.peer.startChannel();

    const unsub = reaction(
      () => this.synchronizationOrderStore.entries,
      () => this.processSyncronizationOrderQueue(peerUserId),
    );

    this.processSyncronizationOrderQueue(peerUserId);

    await lastValueFrom(
      this.queue.pipe(
        distinct(({ id }) => id),
        mergeMap(this.handleOrder),
        takeUntil(fromEventPattern(this.peer.onclose)),
      ),
    );

    unsub();
  }

  private async processSyncronizationOrderQueue(peerUserId: string) {
    return (await this.synchronizationOrder.getMany({ userId: peerUserId })).forEach((order) => {
      this.queue.next(order);
    });
  }

  private async handleOrder(order: SynchronizationOrder) {
    if (order.action === 'create') {
      switch (order.entity) {
        case fund: {
          const entity = await this.fund.getOneBy({ id: order.entityId });

          return this.syncEntity({
            operation: 'create',
            entityType: fund,
            entity,
            order,
            needConfirmation: true,
            successMessage: `The peer accepted your fund "${entity?.title}"`,
            failureMessage: `The peer refused your fund "${entity?.title}"`,
          });
        }
        case cost: {
          return this.syncEntity({
            operation: 'create',
            entityType: cost,
            entity: await this.cost.getOneBy({ id: order.entityId }),
            order,
            needConfirmation: false,
          });
        }
        case income: {
          return this.syncEntity({
            operation: 'create',
            entityType: income,
            entity: await this.income.getOneBy({ id: order.entityId }),
            order,
            needConfirmation: false,
          });
        }
        case tag: {
          return this.syncEntity({
            operation: 'create',
            entityType: tag,
            entity: await this.tag.getOneBy({ id: order.entityId }),
            order,
            needConfirmation: false,
          });
        }
        case wallet: {
          const entity = await this.wallet.getOneBy({ id: order.entityId });

          return this.syncEntity({
            operation: 'create',
            entityType: wallet,
            entity,
            order,
            needConfirmation: true,
            successMessage: `The peer accepted your wallet "${entity?.title}"`,
            failureMessage: `The peer refused your wallet "${entity?.title}"`,
          });
        }
      }
    }

    if (order.action === 'update') {
      switch (order.entity) {
        case fund: {
          return this.syncEntity({
            operation: 'update',
            entityType: fund,
            entity: await this.fund.getOneBy({ id: order.entityId }),
            order,
            needConfirmation: false,
          });
        }
        case cost: {
          return this.syncEntity({
            operation: 'update',
            entityType: cost,
            entity: await this.cost.getOneBy({ id: order.entityId }),
            order,
            needConfirmation: false,
          });
        }
        case income: {
          return this.syncEntity({
            operation: 'update',
            entityType: income,
            entity: await this.income.getOneBy({ id: order.entityId }),
            order,
            needConfirmation: false,
          });
        }
        case tag: {
          return this.syncEntity({
            operation: 'update',
            entityType: tag,
            entity: await this.tag.getOneBy({ id: order.entityId }),
            order,
            needConfirmation: false,
          });
        }
        case wallet: {
          return this.syncEntity({
            operation: 'update',
            entityType: wallet,
            entity: await this.wallet.getOneBy({ id: order.entityId }),
            order,
            needConfirmation: false,
          });
        }
      }
    }
  }

  private async syncEntity(
    params: {
      entityType: string;
      entity: unknown;
      order: SynchronizationOrder;
      operation: z.infer<typeof synchronizationOrderSchema.shape.action>;
    } & (
      | {
          needConfirmation: false;
        }
      | {
          needConfirmation: true;
          successMessage: string;
          failureMessage: string;
        }
    ),
  ) {
    const { entity, entityType, needConfirmation, order, operation } = params;

    assert(entity, 'Cannot find record to synchronize');
    assert(hasProperty(entity, 'id'), 'Invalid type of entity');

    this.synchronizationOrderStore.startSyncingOrder();
    this.peer.send(PEER_EVENTS.SYNC_ENTITY, {
      needConfirmation,
      entityType,
      value: entity,
      operation,
    });

    while (true) {
      const response = await this.peer.receive(PEER_EVENTS.ENTITY_ACCEPTED, entityAcceptedSchema);

      if (response.entityId === entity.id) {
        this.synchronizationOrder.removeOneBy({ id: order.id });

        if (needConfirmation) {
          if (response.answer) {
            this.notification.success(params.successMessage);
          } else {
            this.notification.error(params.failureMessage);
          }
        }

        break;
      }
    }

    this.synchronizationOrderStore.stopSyncingOrder();
  }

  private buildAcceptAnswer(entityType: string, entityId: string, answer: boolean) {
    return {
      entityType,
      entityId,
      answer,
    };
  }
}

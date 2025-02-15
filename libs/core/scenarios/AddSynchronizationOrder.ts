import { inject, injectable } from 'inversify';
import { Repo } from 'core/shared/types';
import { assertEntity } from 'core/shared/assertions';
import { SynchronizationOrder } from 'core/entities/SynchronizationOrder';
import { BaseScenario } from './BaseScenario';
import { TOKENS } from 'core/types';
import { ENTITY_NAME } from 'core/shared/constants';

export type AddSynchronizationOrderParams = Parameters<Repo<SynchronizationOrder, 'id'>['create']>[0];

@injectable()
export class AddSynchronizationOrder extends BaseScenario<AddSynchronizationOrderParams> {
  constructor(
    @inject(TOKENS.SYNCHRONIZATION_ORDER_REPO)
    private readonly synchronizationOrderRepo: Repo<SynchronizationOrder, 'id'>,
  ) {
    super();
  }

  async execute() {
    const existingOrder = await this.synchronizationOrderRepo.getOneBy({
      entity: this.params.entity,
      entityId: this.params.entityId,
      action: this.params.action,
    });

    if (existingOrder) {
      const entity = await this.synchronizationOrderRepo.updateOneBy(
        {
          id: existingOrder.id,
        },
        this.params,
      );
      assertEntity(entity, ENTITY_NAME.SYNCHRONIZATION_ORDER);
    } else {
      const entity = await this.synchronizationOrderRepo.create(this.params);
      assertEntity(entity, ENTITY_NAME.SYNCHRONIZATION_ORDER);
    }
  }

  async revert(): Promise<void> {}
}

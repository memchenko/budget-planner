import { inject, injectable } from 'inversify';

import { BaseScenario } from 'core/scenarios/BaseScenario';
import { TOKENS } from 'core/types';
import { SharingRule } from 'core/entities';
import { AddSynchronizationOrder } from 'core/scenarios/AddSynchronizationOrder';
import { ENTITY_NAME } from './constants';
import { Repo } from './types';
import { assertEntity } from './assertions';

export const buildDeleteEntityScenario = <E extends { id: unknown }>(params: {
  repoType: (typeof TOKENS)[keyof typeof TOKENS];
  entityName: (typeof ENTITY_NAME)[keyof typeof ENTITY_NAME];
  sharingRuleEntityName?: SharingRule['entity'];
}) => {
  @injectable()
  class ScenarioClass extends BaseScenario<{ id: E['id'] }> {
    constructor(
      @inject(params.repoType) private readonly repo: Repo<E, 'id'>,
      @inject(TOKENS.SHARING_RULE_REPO) private readonly sharingRuleRepo: Repo<SharingRule, 'id'>,
      @inject(AddSynchronizationOrder) private readonly addSynchronizationOrderScenario: AddSynchronizationOrder,
    ) {
      super();
    }

    async execute(): Promise<void> {
      const filters = { id: this.params.id } as { [Key in keyof E]: E[Key] };
      await this.repo.removeOneBy(filters);

      if (params.sharingRuleEntityName) {
        const sharingRule = await this.sharingRuleRepo.getOneBy({
          entity: params.sharingRuleEntityName,
          entityId: this.params.id as string,
        });

        if (sharingRule) {
          await this.addSynchronizationOrderScenario.run({
            entity: sharingRule.entity,
            entityId: sharingRule.entityId as string,
            action: 'delete',
            userId: sharingRule.userId,
          });
        }
      }
    }

    async revert(): Promise<void> {}
  }

  Object.defineProperty(ScenarioClass, 'name', {
    value: params.entityName,
    writable: true,
  });

  return ScenarioClass;
};

export const buildCreateEntityScenario = <E extends { id: unknown }>(params: {
  repoType: (typeof TOKENS)[keyof typeof TOKENS];
  entityName: (typeof ENTITY_NAME)[keyof typeof ENTITY_NAME];
}) => {
  @injectable()
  class ScenarioClass extends BaseScenario<Omit<E, 'id'>, E> {
    constructor(@inject(params.repoType) private readonly repo: Repo<E, 'id'>) {
      super();
    }

    async execute(): Promise<E> {
      const entity = await this.repo.create(this.params);
      assertEntity(entity, params.entityName);

      return entity;
    }

    async revert(): Promise<void> {}
  }

  Object.defineProperty(ScenarioClass, 'name', {
    value: params.entityName,
    writable: true,
  });

  return ScenarioClass;
};

export const buildUpdateEntityScenario = <E extends { id: unknown }>(params: {
  repoType: (typeof TOKENS)[keyof typeof TOKENS];
  entityName: (typeof ENTITY_NAME)[keyof typeof ENTITY_NAME];
  sharingRuleEntityName?: SharingRule['entity'];
}) => {
  @injectable()
  class ScenarioClass extends BaseScenario<Partial<E>, E> {
    constructor(
      @inject(params.repoType) private readonly repo: Repo<E, 'id'>,
      @inject(TOKENS.SHARING_RULE_REPO) private readonly sharingRuleRepo: Repo<SharingRule, 'id'>,
      @inject(AddSynchronizationOrder) private readonly addSynchronizationOrderScenario: AddSynchronizationOrder,
    ) {
      super();
    }

    async execute(): Promise<E> {
      const { id, ...patch } = this.params;
      const filters = { id } as { [Key in keyof E]: E[Key] };
      const entity = await this.repo.updateOneBy(filters, patch);
      assertEntity(entity, params.entityName);

      if (params.sharingRuleEntityName) {
        const sharingRule = await this.sharingRuleRepo.getOneBy({
          entity: params.sharingRuleEntityName,
          entityId: entity.id as string,
        });

        if (sharingRule) {
          await this.addSynchronizationOrderScenario.run({
            entity: sharingRule.entity,
            entityId: sharingRule.entityId as string,
            action: 'update',
            userId: sharingRule.userId,
          });
        }
      }

      return entity;
    }

    async revert(): Promise<void> {}
  }

  Object.defineProperty(ScenarioClass, 'name', {
    value: params.entityName,
    writable: true,
  });

  return ScenarioClass;
};

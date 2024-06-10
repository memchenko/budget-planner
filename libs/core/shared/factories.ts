import { inject } from 'inversify';

import { BaseScenario } from '../scenarios/BaseScenario';
import { TYPES } from '../types';
import { ENTITY_NAME } from './constants';
import { Repo } from './types';
import { assertEntity } from './assertions';

export const buildDeleteEntityScenario = <E extends { id: unknown }>(params: {
  repoType: (typeof TYPES)[keyof typeof TYPES];
  entityName: (typeof ENTITY_NAME)[keyof typeof ENTITY_NAME];
}) => {
  class ScenarioClass extends BaseScenario<{ id: E['id'] }> {
    @inject(params.repoType)
    private readonly repo!: Repo<E, 'id'>;

    async execute(): Promise<void> {
      const filters = { id: this.params.id } as { [Key in keyof E]: E[Key] };
      await this.repo.removeOneBy(filters);
    }

    async revert(): Promise<void> {}
  }

  (ScenarioClass as any).name = `Delete${params.entityName}`;

  return ScenarioClass;
};

export const buildCreateEntityScenario = <E extends { id: unknown }>(params: {
  repoType: (typeof TYPES)[keyof typeof TYPES];
  entityName: (typeof ENTITY_NAME)[keyof typeof ENTITY_NAME];
}) => {
  class ScenarioClass extends BaseScenario<Omit<E, 'id'>, E> {
    @inject(params.repoType)
    private readonly repo!: Repo<E, 'id'>;

    async execute(): Promise<E> {
      const entity = await this.repo.create(this.params);
      assertEntity(entity, params.entityName);

      return entity;
    }

    async revert(): Promise<void> {}
  }

  (ScenarioClass as any).name = `Create${params.entityName}`;

  return ScenarioClass;
};

export const buildUpdateEntityScenario = <E extends { id: unknown }>(params: {
  repoType: (typeof TYPES)[keyof typeof TYPES];
  entityName: (typeof ENTITY_NAME)[keyof typeof ENTITY_NAME];
}) => {
  class ScenarioClass extends BaseScenario<Partial<E>, E> {
    @inject(params.repoType)
    private readonly repo!: Repo<E, 'id'>;

    async execute(): Promise<E> {
      const { id, ...patch } = this.params;
      const filters = { id } as { [Key in keyof E]: E[Key] };
      const entity = await this.repo.updateOneBy(filters, patch);
      assertEntity(entity, params.entityName);

      return entity;
    }

    async revert(): Promise<void> {}
  }

  (ScenarioClass as any).name = `Update${params.entityName}`;

  return ScenarioClass;
};

import { inject, injectable } from 'inversify';

import { BaseScenario } from '../scenarios/BaseScenario';
import { TOKENS } from '../types';
import { ENTITY_NAME } from './constants';
import { Repo } from './types';
import { assertEntity } from './assertions';

export const buildDeleteEntityScenario = <E extends { id: unknown }>(params: {
  repoType: (typeof TOKENS)[keyof typeof TOKENS];
  entityName: (typeof ENTITY_NAME)[keyof typeof ENTITY_NAME];
}) => {
  @injectable()
  class ScenarioClass extends BaseScenario<{ id: E['id'] }> {
    @inject(params.repoType)
    private readonly repo!: Repo<E, 'id'>;

    async execute(): Promise<void> {
      const filters = { id: this.params.id } as { [Key in keyof E]: E[Key] };
      await this.repo.removeOneBy(filters);
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
    @inject(params.repoType)
    private readonly repo!: Repo<E, 'id'>;

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
}) => {
  @injectable()
  class ScenarioClass extends BaseScenario<Partial<E>, E> {
    @inject(params.repoType)
    private readonly repo!: Repo<E, 'id'>;

    async execute(): Promise<E> {
      const { id, ...patch } = this.params;
      debugger;
      const filters = { id } as { [Key in keyof E]: E[Key] };
      const entity = await this.repo.updateOneBy(filters, patch);
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

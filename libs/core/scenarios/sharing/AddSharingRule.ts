import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';
import { Repo } from 'core/shared/types';
import {
  tag as tagTypeName,
  income as incomeTypeName,
  cost as costTypeName,
  wallet as walletTypeName,
  fund as fundTypeName,
} from 'core/shared/schemas';
import { SharingRule } from 'core/entities/SharingRule';
import { Tag } from 'core/entities/Tag';
import { Income } from 'core/entities/Income';
import { Cost } from 'core/entities/Cost';
import { TOKENS } from 'core/types';
import { BaseScenario } from 'core/scenarios/BaseScenario';
import { AddSynchronizationOrder } from 'core/scenarios/AddSynchronizationOrder';

const ADD_SHARING_RULE_ERROR = "Couldn't add sharing rule";

export type AddSharingRuleParams = Parameters<Repo<SharingRule, 'id'>['create']>[0];

@injectable()
export class AddSharingRule extends BaseScenario<AddSharingRuleParams> {
  constructor(
    @inject(TOKENS.SHARING_RULE_REPO) private readonly sharingRuleRepo: Repo<SharingRule, 'id'>,
    @inject(TOKENS.TAG_REPO) private readonly tagRepo: Repo<Tag, 'id'>,
    @inject(TOKENS.INCOME_REPO) private readonly incomeRepo: Repo<Income, 'id'>,
    @inject(TOKENS.COST_REPO) private readonly costRepo: Repo<Cost, 'id'>,
    @inject(AddSynchronizationOrder) private readonly addSynchronizationOrderScenario: AddSynchronizationOrder,
  ) {
    super();
  }

  async execute() {
    const sharingRule = await this.sharingRuleRepo.getOneBy({
      entity: this.params.entity,
      entityId: this.params.entityId,
      ownerId: this.params.ownerId,
    });

    if (sharingRule !== null) {
      return;
    }

    const nonNullableSharingRule = await this.sharingRuleRepo.create(this.params);
    assert(nonNullableSharingRule, ADD_SHARING_RULE_ERROR);

    await this.addSynchronizationOrderScenario.run({
      entity: this.params.entity,
      entityId: this.params.entityId as string,
      action: 'create',
      userId: this.params.userId,
    });

    await Promise.all(
      nonNullableSharingRule.relatedEntities.map((entityType) => {
        switch (entityType) {
          case tagTypeName:
            return this.addTagSyncOrder(nonNullableSharingRule);
          case incomeTypeName:
            return this.addIncomeSyncOrder(nonNullableSharingRule);
          case costTypeName:
            return this.addCostSyncOrder(nonNullableSharingRule);
        }
      }),
    );
  }

  private async addTagSyncOrder(sharingRule: SharingRule) {
    const relatedTags = (await this.tagRepo.getAll()).filter((tag) =>
      tag.entities.some(({ entity, entityId }) => sharingRule.entity === entity && sharingRule.entityId === entityId),
    );

    return Promise.all(
      relatedTags.map((relatedTag) =>
        this.addSynchronizationOrderScenario.run({
          entity: tagTypeName,
          entityId: relatedTag.id,
          action: 'create',
          userId: sharingRule.userId,
        }),
      ),
    );
  }

  private async addIncomeSyncOrder(sharingRule: SharingRule) {
    if (
      (sharingRule.entity !== walletTypeName && sharingRule.entity !== fundTypeName) ||
      sharingRule.entityId === null
    ) {
      return;
    }

    const relatedIncomes = await this.incomeRepo.getMany({
      entity: sharingRule.entity,
      entityId: sharingRule.entityId,
    });

    return Promise.all(
      relatedIncomes.map((relatedIncome) =>
        this.addSynchronizationOrderScenario.run({
          entity: incomeTypeName,
          entityId: relatedIncome.id,
          action: 'create',
          userId: sharingRule.userId,
        }),
      ),
    );
  }

  private async addCostSyncOrder(sharingRule: SharingRule) {
    if (
      (sharingRule.entity !== walletTypeName && sharingRule.entity !== fundTypeName) ||
      sharingRule.entityId === null
    ) {
      return;
    }

    const relatedCosts = await this.costRepo.getMany({
      entity: sharingRule.entity,
      entityId: sharingRule.entityId,
    });

    return Promise.all(
      relatedCosts.map((relatedCost) =>
        this.addSynchronizationOrderScenario.run({
          entity: costTypeName,
          entityId: relatedCost.id,
          action: 'create',
          userId: sharingRule.userId,
        }),
      ),
    );
  }

  async revert() {}
}

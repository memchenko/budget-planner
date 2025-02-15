import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';
import { Repo } from 'core/shared/types';
import { SharingRule } from 'core/entities/SharingRule';
import { TOKENS } from 'core/types';
import { BaseScenario } from 'core/scenarios/BaseScenario';
import { AddSynchronizationOrder } from 'core/scenarios/AddSynchronizationOrder';

const ADD_SHARING_RULE_ERROR = "Couldn't add sharing rule";

export type AddSharingRuleParams = Parameters<Repo<SharingRule, 'id'>['create']>[0];

@injectable()
export class AddSharingRule extends BaseScenario<AddSharingRuleParams> {
  constructor(
    @inject(TOKENS.SHARING_RULE_REPO) private readonly sharingRuleRepo: Repo<SharingRule, 'id'>,
    @inject(AddSynchronizationOrder) private readonly addSynchronizationOrderScenario: AddSynchronizationOrder,
  ) {
    super();
  }

  private sharingRule: SharingRule | null = null;

  async execute() {
    const sharingRule = await this.sharingRuleRepo.getOneBy({
      entity: this.params.entity,
      entityId: this.params.entityId,
      ownerId: this.params.ownerId,
    });

    if (sharingRule !== null) {
      return;
    }

    this.sharingRule = await this.sharingRuleRepo.create(this.params);
    assert(this.sharingRule, ADD_SHARING_RULE_ERROR);

    await this.addSynchronizationOrderScenario.run({
      entity: this.params.entity,
      entityId: this.params.entityId as string,
      action: 'create',
      userId: this.params.userId,
    });
  }

  async revert() {}
}

import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';
import { Repo } from 'core/shared/types';
import { SharingRule } from 'core/entities/SharingRule';
import { TOKENS } from 'core/types';
import { BaseScenario } from 'core/scenarios/BaseScenario';
import { AddSynchronizationOrder } from 'core/scenarios/AddSynchronizationOrder';
import { assertEntity } from 'core/shared/assertions';
import { ENTITY_NAME } from 'core/shared/constants';
import { User } from 'core/entities';
import { sharingRule } from 'core/shared/schemas';

const DELETE_SHARING_RULE_ERROR = "Couldn't delete sharing rule";

export interface DeleteSharingRuleParams {
  userId: User['id'];
  id: SharingRule['id'];
}

@injectable()
export class DeleteSharingRule extends BaseScenario<DeleteSharingRuleParams> {
  constructor(
    @inject(TOKENS.SHARING_RULE_REPO) private readonly sharingRuleRepo: Repo<SharingRule, 'id'>,
    @inject(AddSynchronizationOrder) private readonly addSynchronizationOrderScenario: AddSynchronizationOrder,
  ) {
    super();
  }

  async execute() {
    const sharingRuleToDelete = await this.sharingRuleRepo.getOneBy({ id: this.params.id });
    assertEntity(sharingRuleToDelete, ENTITY_NAME.SHARING_RULE);

    const isSharingRuleDeleted = await this.sharingRuleRepo.removeOneBy({ id: this.params.id });
    assert(isSharingRuleDeleted, DELETE_SHARING_RULE_ERROR);

    const syncWithUserId =
      sharingRuleToDelete.ownerId === this.params.userId ? sharingRuleToDelete.userId : sharingRuleToDelete.ownerId;

    await this.addSynchronizationOrderScenario.run({
      entity: sharingRule,
      entityId: this.params.id,
      action: 'delete',
      userId: syncWithUserId,
    });
  }

  async revert() {}
}

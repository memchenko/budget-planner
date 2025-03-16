import { inject, injectable } from 'inversify';
import { Repo } from 'core/shared/types';
import { assertEntity } from 'core/shared/assertions';
import { AddSynchronizationOrder } from '../AddSynchronizationOrder';
import { Tag } from 'core/entities/Tag';
import { SharingRule } from 'core/entities/SharingRule';
import { BaseScenario } from '../BaseScenario';
import { TOKENS } from 'core/types';
import { ENTITY_NAME } from 'core/shared/constants';
import { tag as tagEntityName } from 'core/shared/schemas';

export type AssignTagToEntityParams = Tag['entities'][number] & {
  tagId: Tag['id'];
};

@injectable()
export class AssignTagToEntity extends BaseScenario<AssignTagToEntityParams> {
  constructor(
    @inject(TOKENS.TAG_REPO) private readonly tagRepo: Repo<Tag, 'id'>,
    @inject(TOKENS.SHARING_RULE_REPO) private readonly sharingRuleRepo: Repo<SharingRule, 'id'>,
    @inject(AddSynchronizationOrder) private readonly addSynchronizationOrder: AddSynchronizationOrder,
  ) {
    super();
  }

  async execute() {
    const tag = await this.tagRepo.getOneBy({ id: this.params.tagId });

    assertEntity(tag, ENTITY_NAME.TAG);

    const hasTheEntityAssigned = tag.entities.some(({ entityId, entity }) => {
      return this.params.entity === entity && this.params.entityId === entityId;
    });

    if (hasTheEntityAssigned) {
      return;
    }

    await this.tagRepo.updateOneBy(
      { id: tag.id },
      {
        entities: tag.entities.concat({
          entity: this.params.entity,
          entityId: this.params.entityId,
        }),
      },
    );

    const parentEntitySharingRule = await this.sharingRuleRepo.getOneBy({
      entity: this.params.entity,
      entityId: this.params.entityId,
    });

    if (parentEntitySharingRule) {
      const tagSharingRule = await this.sharingRuleRepo.getOneBy({
        entity: tagEntityName,
        entityId: tag.id,
      });
      const syncWithUserId =
        tag.userId === parentEntitySharingRule.ownerId
          ? parentEntitySharingRule.userId
          : parentEntitySharingRule.ownerId;

      await this.addSynchronizationOrder.run({
        entity: tagEntityName,
        action: !tagSharingRule ? 'create' : 'update',
        entityId: tag.id,
        userId: syncWithUserId,
      });
    }
  }

  async revert(): Promise<void> {}
}

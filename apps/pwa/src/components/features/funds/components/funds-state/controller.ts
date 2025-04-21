import { provide } from 'inversify-binding-decorators';
import { User } from '@nextui-org/user';
import { Badge } from '@nextui-org/badge';
import cn from 'classnames';
import { createElement } from 'react';
import { inject } from 'inversify';
import { makeAutoObservable } from 'mobx';
import feather from 'feather-icons';
import { TOKENS } from '~/shared/constants/di';
import * as userStore from '~/stores/user';
import * as appStore from '~/stores/app';
import * as fundStore from '~/stores/fund';
import * as sharingRuleStore from '~/stores/sharing-rule';
import { ScenarioRunner } from '~/shared/impl/scenario-runner';
import { assert } from 'ts-essentials';
import { MenuProps } from '~/components/ui/menu';
import { INavigateFunc } from '~/shared/interfaces';
import { pages } from '~/shared/constants/pages';

@provide(FundsStateController)
export class FundsStateController {
  isUsersMenuOpened = false;

  constructor(
    @inject(TOKENS.APP_STORE)
    private readonly appStore: appStore.App,
    @inject(TOKENS.USER_STORE)
    private readonly userStore: userStore.User,
    @inject(TOKENS.FUND_STORE)
    private readonly fundStore: fundStore.Fund,
    @inject(TOKENS.SCENARIO_RUNNER)
    private readonly scenarioRunner: ScenarioRunner,
    @inject(TOKENS.NAVIGATE_FUNC)
    private readonly navigate: INavigateFunc,
    @inject(TOKENS.SHARING_RULE_STORE)
    private readonly sharingRuleStore: sharingRuleStore.SharingRule,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  getUsersToShareWith(fundId: fundStore.EntityType['id']) {
    return this.userStore.externals.map(({ id, avatarSrc, firstName, lastName }) => {
      return {
        id,
        avatarSrc,
        name: `${firstName} ${lastName}`,
        isShared: this.sharingRuleStore.isSharedWithUser('fund', fundId, id),
      };
    });
  }

  shouldDisplayMenu(fundId: fundStore.EntityType['id']) {
    const ownerId = this.fundStore.getFund(fundId)?.userId;

    return this.userStore.current.id === ownerId;
  }

  getMenu(fundId: fundStore.EntityType['id']): MenuProps['items'] {
    if (this.isUsersMenuOpened) {
      return this.getUsersToShareWith(fundId).map(({ id, name, avatarSrc }) => {
        const isShared = this.sharingRuleStore.isSharedWithUser('fund', fundId, id);
        const user = createElement(User, {
          name,
          avatarProps: { src: avatarSrc },
          className: cn('flex justify-start', {
            'opacity-50': isShared,
          }),
        });
        const view = isShared
          ? createElement(Badge, {
              color: 'success',
              placement: 'top-left',
              shape: 'circle',
              size: 'lg',
              variant: 'solid',
              content: createElement('span', {
                dangerouslySetInnerHTML: {
                  __html: feather.icons.check.toSvg({ width: 10, height: 10 }),
                },
              }),
              children: user,
            })
          : user;

        return {
          key: id,
          view,
          action: !isShared ? this.handleUserClick.bind(null, id, fundId) : () => {},
        };
      });
    }

    return [
      {
        key: 'edit',
        view: 'Edit',
        action: this.navigate.bind(null, pages.editFund, { id: fundId }),
      },
      {
        key: 'share',
        view: 'Share',
        action: this.handleShareOptionClick,
      },
    ];
  }

  handleShareOptionClick() {
    this.isUsersMenuOpened = true;
  }

  handleUserClick(userId: userStore.EntityType['id'], fundId: fundStore.EntityType['id']) {
    assert(this.appStore.userId, 'No current user found');

    this.isUsersMenuOpened = false;

    this.scenarioRunner.execute({
      scenario: 'AddSharingRule',
      payload: {
        userId,
        ownerId: this.appStore.userId,
        entityId: fundId,
        entity: 'fund',
        relatedEntities: ['cost', 'income', 'tag'],
      },
    });
  }

  reset() {
    this.isUsersMenuOpened = false;
  }
}

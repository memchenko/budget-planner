import { provide } from 'inversify-binding-decorators';
import { User } from '@nextui-org/user';
import { createElement } from 'react';
import { inject } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { TOKENS } from '~/shared/constants/di';
import * as userStore from '~/stores/user';
import * as appStore from '~/stores/app';
import * as fundStore from '~/stores/fund';
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
    @inject(TOKENS.SCENARIO_RUNNER)
    private readonly scenarioRunner: ScenarioRunner,
    @inject(TOKENS.NAVIGATE_FUNC)
    private readonly navigate: INavigateFunc,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get shouldDisplayMenu() {
    return this.userStore.hasAnyExternal;
  }

  get usersToShareWith() {
    return this.userStore.externals.map(({ id, avatarSrc, firstName, lastName }) => {
      return {
        id,
        avatarSrc,
        name: `${firstName} ${lastName}`,
      };
    });
  }

  getMenu(fundId: fundStore.EntityType['id']): MenuProps['items'] {
    if (this.isUsersMenuOpened) {
      return this.usersToShareWith.map(({ id, name, avatarSrc }) => ({
        key: id,
        view: createElement(User, {
          name,
          avatarProps: { src: avatarSrc },
          className: 'flex justify-start',
        }),
        action: this.handleUserClick.bind(null, id, fundId),
      }));
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

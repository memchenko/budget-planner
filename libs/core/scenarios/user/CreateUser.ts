import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from '#/libs/core/shared/types';
import { User } from '#/libs/core/entities/User';
import { Wallet } from '#/libs/core/entities/Wallet';
import { TOKENS } from '#/libs/core/types';
import { BaseScenario } from '#/libs/core/scenarios/BaseScenario';
import { ScenarioError } from '#/libs/core/errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '#/libs/core/shared/constants';

const CREATE_USER_ERROR = "Couldn't create a user";
const CREATE_WALLET_ERROR = "Couldn't create a wallet";
const REVERT_SCENARIO_ERROR = "Couldn't revert scenario. User wasn't created";

export interface CreateUserParams {
  firstName: string;
  lastName: string;
  avatarSrc: string;
}

@injectable()
export class CreateUser extends BaseScenario<CreateUserParams, User> {
  constructor(
    @inject(TOKENS.USER_REPO)
    private userRepo: Repo<User, 'id'>,
    @inject(TOKENS.WalletRepo)
    private walletRepo: Repo<Wallet, 'id'>,
  ) {
    super();
  }

  private user: User | null = null;
  private wallet: Wallet | null = null;

  async execute() {
    this.user = await this.userRepo.create(this.params);

    assert(this.user !== null, CREATE_USER_ERROR);

    this.wallet = await this.walletRepo.create({
      userId: this.user.id,
      title: 'My wallet',
      balance: 0,
    });

    assert(this.wallet !== null, CREATE_WALLET_ERROR);

    return this.user;
  }

  async revert() {
    assert(this.error instanceof Error, UNKNOWN_ERROR_TEXT);
    assert(this.error instanceof ScenarioError, this.error.message);

    if (this.error.message === CREATE_WALLET_ERROR) {
      assert(this.user !== null, REVERT_SCENARIO_ERROR);
      await this.userRepo.removeOneBy({ id: this.user.id });
    }
  }
}

import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';

import { Repo } from '../../shared/types';
import { User } from '../../entities/User';
import { Fund } from '../../entities/Fund';
import { TOKENS } from '../../types';
import { BaseScenario } from '../BaseScenario';
import { ScenarioError } from '../../errors/ScenarioError';
import { UNKNOWN_ERROR_TEXT } from '../../shared/constants';

const CREATE_USER_ERROR = "Couldn't create a user";
const CREATE_FUND_ERROR = "Couldn't create a fund";
const REVERT_SCENARIO_ERROR = "Couldn't revert scenario. User wasn't created";

export interface CreateUserParams {}

@injectable()
export class CreateUser extends BaseScenario<CreateUserParams, User> {
  @inject(TOKENS.UserRepo)
  readonly userRepo!: Repo<User, 'id'>;

  @inject(TOKENS.FundRepo)
  readonly fundRepo!: Repo<Fund, 'id'>;

  private user: User | null = null;
  private fund: Fund | null = null;

  async execute() {
    this.user = await this.userRepo.create({});

    assert(this.user !== null, CREATE_USER_ERROR);

    this.fund = await this.fundRepo.create({
      userId: this.user.id,
      isMain: true,
      title: null,
      balance: 0,
      priority: -1,
      capacity: -1,
      isCumulative: true,
      isEager: false,
    });

    assert(this.fund !== null, CREATE_FUND_ERROR);

    return this.user;
  }

  async revert() {
    assert(this.error instanceof Error, UNKNOWN_ERROR_TEXT);
    assert(this.error instanceof ScenarioError, this.error.message);

    if (this.error.message === CREATE_FUND_ERROR) {
      assert(this.user !== null, REVERT_SCENARIO_ERROR);
      await this.userRepo.removeOneBy({ id: this.user.id });
    }
  }
}

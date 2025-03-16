import { faker } from '@faker-js/faker';
import { test as base } from 'vitest';
import { Cost } from 'core/entities/Cost';
import { Fund } from 'core/entities/Fund';
import { Income } from 'core/entities/Income';
import { Tag } from 'core/entities/Tag';
import { User } from 'core/entities/User';
import { Wallet } from 'core/entities/Wallet';
import { SharingRule } from 'core/entities/SharingRule';
import { SynchronizationOrder } from 'core/entities/SynchronizationOrder';
import { wallet, cost, fund, income, tag } from 'core/shared/schemas';
import { scenariosModule } from 'core/index';
import { InMemoryRepo } from 'core/tests/mocks';
import { Container } from 'inversify';
import { TOKENS } from 'core/types';
import { Repo } from 'core/shared/types';

export class UserFixture {
  custom(override: Partial<User> = {}): User {
    return {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatarSrc: faker.image.avatar(),
      ...override,
    };
  }

  get default() {
    return this.custom();
  }
}

export class WalletFixture {
  constructor(private readonly userId: string) {}

  custom(override: Partial<Wallet> = {}): Wallet {
    return {
      id: faker.string.uuid(),
      userId: this.userId,
      title: faker.finance.accountName(),
      balance: faker.number.float({ min: 0, max: 10000, fractionDigits: 2 }),
      ...override,
    };
  }

  get default() {
    return this.custom();
  }
}

export class FundFixture {
  constructor(private readonly userId: string) {}

  custom(override: Partial<Fund> = {}): Fund {
    const capacity = faker.number.float({ min: 1000, max: 50000, fractionDigits: 2 });

    return {
      id: faker.string.uuid(),
      userId: this.userId,
      title: faker.commerce.productName(),
      balance: faker.number.float({ min: -capacity, max: capacity, fractionDigits: 2 }),
      priority: faker.number.int({ min: 1 }),
      capacity,
      isCumulative: faker.datatype.boolean(),
      isEager: faker.datatype.boolean(),
      calculateDailyLimit: faker.datatype.boolean(),
      externalWalletId: faker.helpers.arrayElement([null, faker.string.uuid()]),
      ...override,
    };
  }

  get default() {
    return this.custom();
  }

  get eager() {
    return this.custom({ userId: this.userId, isEager: true });
  }

  get culculatingDailyLimit() {
    return this.custom({ userId: this.userId, calculateDailyLimit: true });
  }

  get cumulative() {
    return this.custom({ userId: this.userId, isCumulative: true });
  }

  get all() {
    return [this.eager, this.culculatingDailyLimit, this.cumulative].map((fund, index) => {
      fund.priority = index + 1;
      return fund;
    });
  }
}

export class CostFixture {
  constructor(private readonly userId: string) {}

  custom(override: Partial<Cost> = {}): Cost {
    return {
      id: faker.string.uuid(),
      userId: this.userId,
      amount: faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
      date: faker.date.recent().getTime(),
      note: faker.helpers.arrayElement([null, faker.commerce.productDescription()]),
      tags: [],
      entity: faker.helpers.arrayElement(['wallet', 'fund']) as 'wallet' | 'fund',
      entityId: faker.string.uuid(),
      ...override,
    };
  }

  get default() {
    return this.custom();
  }

  get rent() {
    return this.custom({ userId: this.userId, amount: 700 });
  }

  get electricity() {
    return this.custom({ userId: this.userId, amount: 1000 });
  }

  get education() {
    return this.custom({ userId: this.userId, amount: 50 });
  }

  get grocery() {
    return this.custom({ userId: this.userId, amount: 15 });
  }

  get hygiene() {
    return this.custom({ userId: this.userId, amount: 10 });
  }

  get transport() {
    return this.custom({ userId: this.userId, amount: 2 });
  }

  get cinema() {
    return this.custom({ userId: this.userId, amount: 15 });
  }

  get restaurant() {
    return this.custom({ userId: this.userId, amount: 30 });
  }

  get allNecessary() {
    return [this.rent, this.electricity, this.education, this.transport];
  }

  get allGrocery() {
    return [this.grocery, this.hygiene];
  }

  get allLeisure() {
    return [this.cinema, this.restaurant];
  }
}

export class IncomeFixture {
  constructor(private readonly userId: string) {}

  custom(override: Partial<Income> = {}): Income {
    return {
      id: faker.string.uuid(),
      userId: this.userId,
      date: faker.date.recent().getTime(),
      note: faker.helpers.arrayElement([null, faker.finance.transactionDescription()]),
      amount: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
      tags: [],
      entity: wallet,
      entityId: faker.string.uuid(),
      ...override,
    };
  }

  get default() {
    return this.custom();
  }

  get salary() {
    return this.custom({ userId: this.userId, amount: 3000 });
  }

  get gift() {
    return this.custom({ userId: this.userId, amount: 50 });
  }

  get all() {
    return [this.salary, this.gift];
  }
}

export class TagFixture {
  constructor(private readonly userId: string) {}

  custom(override: Partial<Tag> = {}): Tag {
    return {
      id: faker.string.uuid(),
      userId: this.userId,
      type: cost,
      title: faker.commerce.department(),
      entities: [
        {
          entity: wallet,
          entityId: faker.string.uuid(),
        },
      ],
      ...override,
    };
  }

  get default() {
    return this.custom();
  }

  get coffee() {
    return this.custom({ userId: this.userId, title: 'Coffee' });
  }

  get tea() {
    return this.custom({ userId: this.userId, title: 'Tea' });
  }

  get foodForCats() {
    return this.custom({ userId: this.userId, title: 'Food for cats' });
  }
  get dinner() {
    return this.custom({ userId: this.userId, title: 'dinner' });
  }
  get fastfood() {
    return this.custom({ userId: this.userId, title: 'fastfood' });
  }
}

export class SharingRuleFixture {
  constructor(private readonly userId: string) {}

  custom(override: Partial<SharingRule> = {}): SharingRule {
    return {
      id: faker.string.uuid(),
      userId: this.userId,
      entityId: faker.string.uuid(),
      ownerId: faker.string.uuid(),
      ...(faker.helpers.arrayElement([
        {
          entity: wallet,
          actions: faker.helpers.arrayElements(['list', 'read-balance']),
        },
        {
          entity: fund,
          actions: faker.helpers.arrayElements(['list', 'read-balance', 'write-cost']),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any),
      ...override,
    };
  }

  get default() {
    return this.custom();
  }
}

export class SynchronizationOrderFixture {
  constructor(private readonly userId: string) {}

  custom(override: Partial<SynchronizationOrder> = {}): SynchronizationOrder {
    return {
      id: faker.string.uuid(),
      userId: this.userId,
      entity: faker.helpers.arrayElement([wallet, fund]),
      entityId: faker.string.uuid(),
      action: faker.helpers.arrayElement(['create', 'update', 'delete']),
      ...override,
    };
  }

  get default() {
    return this.custom();
  }
}

export class FixturePreset {
  constructor(
    private readonly stores: { user: Map<string, User>; wallet: Map<string, Wallet>; fund: Map<string, Fund> },
  ) {}

  get initial() {
    const user = new UserFixture().default;
    const wallet = new WalletFixture(user.id).default;

    this.stores.user.set(user.id, user);
    this.stores.wallet.set(wallet.id, wallet);

    return { user, wallet };
  }

  get default() {
    const { user, wallet } = this.initial;
    const { eager, culculatingDailyLimit, cumulative } = new FundFixture(user.id);
    const { rent, electricity, education, transport, grocery, hygiene, cinema, restaurant } = new CostFixture(user.id);
    const { salary, gift } = new IncomeFixture(user.id);
    const { coffee, tea, foodForCats, dinner, fastfood } = new TagFixture(user.id);

    this.stores.user.set(user.id, user);
    this.stores.wallet.set(wallet.id, wallet);
  }

  get minimalistic() {
    const { user, wallet } = this.initial;
    const { eager: fund } = new FundFixture(user.id);

    this.stores.user.set(user.id, user);
    this.stores.wallet.set(wallet.id, wallet);
    this.stores.fund.set(fund.id, fund);

    return { user, wallet, fund };
  }

  get cooperative() {}
}

export const createDefaultSetup = (stores: {
  user: Map<string, User>;
  wallet: Map<string, Wallet>;
  fund: Map<string, Fund>;
  cost: Map<string, Cost>;
  tag: Map<string, Tag>;
}) => {
  const { user, wallet } = createInitialSetup(stores);

  const fundNecessary = createFund({ userId: user.id, isEager: true, priority: 1 });
  stores.fund.set(fundNecessary.id, fundNecessary);

  const fundGrocery = createFund({ userId: user.id, calculateDailyLimit: true, priority: 2 });
  stores.fund.set(fundGrocery.id, fundGrocery);

  const fundLeisure = createFund({ userId: user.id, isCumulative: true, priority: 3 });
  stores.fund.set(fundLeisure.id, fundLeisure);

  const tagGrocery = createTag({ userId: user.id, title: 'Grocery' });
  stores.tag.set(tagGrocery.id, tagGrocery);

  const cost1 = createCost({ userId: user.id, entityId: wallet.id });
};

export const test = base.extend({
  stores: async ({}, use) => {
    const stores = {
      user: new Map<string, User>(),
      wallet: new Map<string, Wallet>(),
      fund: new Map<string, Fund>(),
      cost: new Map<string, Cost>(),
      income: new Map<string, Income>(),
      tag: new Map<string, Tag>(),
      sharingRule: new Map<string, SharingRule>(),
      synchronizationOrder: new Map<string, SynchronizationOrder>(),
    };

    const container = new Container();
    container.bind<Repo<Cost>>(TOKENS.COST_REPO).toDynamicValue(() => new InMemoryRepo<Cost>(stores.cost));
    container.bind<Repo<Fund>>(TOKENS.FUND_REPO).toDynamicValue(() => new InMemoryRepo<Fund>(stores.fund));
    container.bind<Repo<Income>>(TOKENS.INCOME_REPO).toDynamicValue(() => new InMemoryRepo<Income>(stores.income));
    container.bind<Repo<Tag>>(TOKENS.TAG_REPO).toDynamicValue(() => new InMemoryRepo<Tag>(stores.tag));
    container.bind<Repo<User>>(TOKENS.USER_REPO).toDynamicValue(() => new InMemoryRepo<User>(stores.user));
    container.bind<Repo<Wallet>>(TOKENS.WALLET_REPO).toDynamicValue(() => new InMemoryRepo<Wallet>(stores.wallet));
    container
      .bind<Repo<SharingRule>>(TOKENS.SHARING_RULE_REPO)
      .toDynamicValue(() => new InMemoryRepo<SharingRule>(stores.sharingRule));
    container
      .bind<Repo<SynchronizationOrder>>(TOKENS.SYNCHRONIZATION_ORDER_REPO)
      .toDynamicValue(() => new InMemoryRepo<SynchronizationOrder>(stores.synchronizationOrder));

    container.load(scenariosModule);

    await use({
      container,
      stores,
    });

    Object.values(stores).forEach((store) => store.clear());
  },
});

declare module 'vitest' {
  export interface TestContext {
    dependencies: {
      container: Container;
      userRepo: Repo<User>;
      costRepo: Repo<Cost>;
      fundRepo: Repo<Fund>;
      incomeRepo: Repo<Income>;
      tagRepo: Repo<Tag>;
      walletRepo: Repo<Wallet>;
      sharingRuleRepo: Repo<SharingRule>;
      synchronizationOrderRepo: Repo<SynchronizationOrder>;
    };
  }
}

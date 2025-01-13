import { ContainerModule } from 'inversify';
import { TOKENS } from '~/shared/constants/di';
import { Cost } from './cost';
import { Fund } from './fund';
import { Income } from './income';
import { Tag } from './tag';
import { User } from './user';
import { Wallet } from './wallet';
import { SharingRule } from './sharing-rule';
import { SynchronizationOrder } from './synchronization-order';

export const entitiesModule = new ContainerModule((bind) => {
  bind(TOKENS.COST_STORE).to(Cost).inSingletonScope();
  bind(TOKENS.FUND_STORE).to(Fund).inSingletonScope();
  bind(TOKENS.INCOME_STORE).to(Income).inSingletonScope();
  bind(TOKENS.TAG_STORE).to(Tag).inSingletonScope();
  bind(TOKENS.USER_STORE).to(User).inSingletonScope();
  bind(TOKENS.WALLET_STORE).to(Wallet).inSingletonScope();
  bind(TOKENS.SHARING_RULE_STORE).to(SharingRule).inSingletonScope();
  bind(TOKENS.SYNCHRONIZATION_ORDER_STORE).to(SynchronizationOrder).inSingletonScope();
});

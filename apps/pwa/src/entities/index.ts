import { ContainerModule } from 'inversify';
import { TOKENS } from '~/shared/constants/di';
import { Cost } from './cost';
import { Fund } from './fund';
import { Income } from './income';
import { Tag } from './tag';
import { User } from './user';
import { Dictionaries } from './dictionaries';
import { Wallet } from './wallet';

export const entitiesModule = new ContainerModule((bind) => {
  bind(TOKENS.COSTS_STORE).to(Cost).inSingletonScope();
  bind(TOKENS.FUNDS_STORE).to(Fund).inSingletonScope();
  bind(TOKENS.INCOMES_STORE).to(Income).inSingletonScope();
  bind(TOKENS.TAGS_STORE).to(Tag).inSingletonScope();
  bind(TOKENS.USERS_STORE).to(User).inSingletonScope();
  bind(TOKENS.DICTIONARIES_STORE).to(Dictionaries).inSingletonScope();
  bind(TOKENS.WALLETS_STORE).to(Wallet).inSingletonScope();
});

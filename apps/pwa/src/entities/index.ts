import { ContainerModule } from 'inversify';
import { TOKENS } from '../lib/app/di';
import { Cost } from './cost';
import { Fund } from './fund';
import { Income } from './income';
import { Tag } from './tag';
import { User } from './user';
import { Dictionaries } from './dictionaries';

export const entitiesModule = new ContainerModule((bind) => {
  bind(TOKENS.CostStore).to(Cost).inSingletonScope();
  bind(TOKENS.FundStore).to(Fund).inSingletonScope();
  bind(TOKENS.IncomeStore).to(Income).inSingletonScope();
  bind(TOKENS.TagStore).to(Tag).inSingletonScope();
  bind(TOKENS.UserStore).to(User).inSingletonScope();
  bind(TOKENS.DictionariesStore).to(Dictionaries).inSingletonScope();
});

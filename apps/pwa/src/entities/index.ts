import { ContainerModule } from 'inversify';
import { TOKENS } from '../lib/app/di';
import { Cost } from './cost';
import { Fund } from './fund';
import { Income } from './income';
import { Tag } from './tag';
import { User } from './user';
import { Dictionaries } from './dictionaries';

export const entitiesModule = new ContainerModule((bind) => {
  bind(TOKENS.CostStore).to(Cost);
  bind(TOKENS.FundStore).to(Fund);
  bind(TOKENS.IncomeStore).to(Income);
  bind(TOKENS.TagStore).to(Tag);
  bind(TOKENS.UserStore).to(User);
  bind(TOKENS.DictionariesStore).to(Dictionaries);
});

import { buildCreateEntityScenario, buildUpdateEntityScenario } from 'core/shared/factories';
import { ENTITY_NAME } from 'core/shared/constants';
import { TOKENS } from 'core/types';
import { Wallet } from 'core/entities/Wallet';

// Wallet entity scenarios
export const CreateWallet = buildCreateEntityScenario<Wallet>({
  entityName: ENTITY_NAME.WALLET,
  repoType: TOKENS.WALLET_REPO,
});

export const UpdateWallet = buildUpdateEntityScenario<Wallet>({
  entityName: ENTITY_NAME.WALLET,
  repoType: TOKENS.WALLET_REPO,
});

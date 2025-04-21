// import { describe, expect } from 'vitest';
// // import { v4 as uuidv4 } from 'uuid';
// import { AddCost } from 'core/scenarios/cost/AddCost';
// import { TOKENS } from 'core/types';
// import { fund, wallet } from 'core/shared/schemas';
// // import { ENTITY_NAME } from 'core/shared/constants';
// // import { ScenarioError } from 'core/errors/ScenarioError';
// import { Repo } from 'core/shared/types';
// import { Cost } from 'core/entities/Cost';
// // import { Income } from 'core/entities/Income';
// import { Fund } from 'core/entities/Fund';
// // import { Wallet } from 'core/entities/Wallet';
// // import { User } from 'core/entities/User';
// // import { Tag } from 'core/entities/Tag';
// // import { SharingRule } from 'core/entities/SharingRule';
// // import { SynchronizationOrder } from 'core/entities/SynchronizationOrder';
// import { createCost, createFund, createUser, createWallet, test } from './fixtures';

// describe('AddCost', () => {
//   test.only('should create cost and subtract from fund balance', async ({ dependencies }) => {
//     const { container } = dependencies;

//     const addCostScenario: AddCost = container.get<AddCost>(AddCost);
//     const fundRepo = container.get<Repo<Fund>>(TOKENS.FUND_REPO);
//     // const walletRepo = container.get<Repo<Wallet>>(TOKENS.WALLET_REPO);
//     const costRepo = container.get<Repo<Cost>>(TOKENS.COST_REPO);
//     // const sharingRuleRepo = container.get<Repo<SharingRule>>(TOKENS.SHARING_RULE_REPO);
//     const amount = 100;

//     await addCostScenario.run({
//       userId: userFixture.id,
//       entity: fund,
//       entityId: fundFixture.id,
//       amount,
//       tags: [],
//       date: Date.now(),
//       note: null,
//     });

//     const updatedFund = await fundRepo.getOneBy({ id: fundFixture.id });
//     const createdCost = (await costRepo.getAll())[0];

//     expect(updatedFund?.balance).toBe(4900);
//     expect(createdCost).toBeTruthy();
//     expect(createdCost?.amount).toBe(amount);
//   });

//   // it('should create cost and subtract from wallet balance', async () => {
//   //   const amount = 200;

//   //   await addCostScenario.run({
//   //     userId,
//   //     entity: wallet,
//   //     entityId: walletId,
//   //     amount,
//   //     currency: 'USD',
//   //     tags: [],
//   //   });

//   //   const updatedWallet = await walletRepo.getOneBy({ id: walletId });
//   //   const createdCost = (await costRepo.getAll())[0];

//   //   expect(updatedWallet?.balance).toBe(800);
//   //   expect(createdCost).toBeTruthy();
//   //   expect(createdCost?.amount).toBe(amount);
//   // });

//   // it('should create cost with tags', async () => {
//   //   await addCostScenario.run({
//   //     userId,
//   //     entity: fund,
//   //     entityId: fundId,
//   //     amount: 100,
//   //     currency: 'USD',
//   //     tags: [tagId],
//   //   });

//   //   const createdCost = (await costRepo.getAll())[0];
//   //   expect(createdCost?.tags).toContain(tagId);
//   // });

//   // it('should create synchronization orders when sharing rule exists', async () => {
//   //   const sharedUserId = uuidv4();

//   //   await sharingRuleRepo.create({
//   //     ownerId: userId,
//   //     userId: sharedUserId,
//   //     entity: fund,
//   //     entityId: fundId,
//   //   });

//   //   await addCostScenario.run({
//   //     userId,
//   //     entity: fund,
//   //     entityId: fundId,
//   //     amount: 100,
//   //     currency: 'USD',
//   //     tags: [],
//   //   });

//   //   const syncOrders = await container.get(TOKENS.SYNCHRONIZATION_ORDER_REPO).getMany({ userId: sharedUserId });

//   //   expect(syncOrders).toHaveLength(2);
//   // });

//   // it('should revert changes on error', async () => {
//   //   const invalidFundId = uuidv4();
//   //   const amount = 100;

//   //   try {
//   //     await addCostScenario.run({
//   //       userId,
//   //       entity: fund,
//   //       entityId: invalidFundId,
//   //       amount,
//   //       currency: 'USD',
//   //       tags: [],
//   //     });
//   //   } catch (error) {
//   //     expect(error).toBeInstanceOf(ScenarioError);
//   //     expect(error.message).toContain(ENTITY_NAME.FUND);
//   //   }

//   //   const costs = await costRepo.getAll();
//   //   expect(costs).toHaveLength(0);
//   // });
// });

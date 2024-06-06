const { DateTime, Interval } = require("luxon");

const user = require("../../entities/user");
const fund = require("../../entities/fund");
const income = require("../../entities/income");
const cost = require("../../entities/cost");

const accountant = {};

accountant.getBudget = async ({ userId }) => {
  const userData = await user.find({ tgId: userId });
  const funds = await fund.findAll({ userId });
  const daysLeftInCurrentMonth =
    Interval.fromDateTimes(DateTime.utc(), DateTime.utc().endOf("month")).count(
      "days"
    ) - 1;

  const fundsBalances = funds
    .map(({ title, balance, calculateDailyLimit, capacity, priority }) => {
      return {
        priority,
        title,
        balance,
        capacity,
        dailyLimit: calculateDailyLimit
          ? balance / daysLeftInCurrentMonth
          : null,
      };
    })
    .sort((a, b) => a.priority - b.priority);
  const total = funds.reduce(
    (acc, fund) => acc + fund.balance,
    userData.balance
  );

  return {
    reserve: userData.balance,
    funds: fundsBalances,
    total,
  };
};

accountant.addIncome = async (data) => {
  const { userId, note, category, amount } = data;

  await income.create({
    userId,
    note,
    category,
    amount,
  });

  return await user.updateBalanceBy({ tgId: userId, amount });
};

accountant.addCost = async (data) => {
  const { userId, fundId, note, category, amount } = data;

  await cost.create({
    userId,
    fundId,
    note,
    category,
    amount,
  });

  return await fund.updateBalanceBy({
    userId,
    fundId,
    amount: amount > 0 ? -amount : amount,
  });
};

accountant.moveWholeBalanceToFund = async (data) => {
  const { userId, fundId } = data;
  const userData = await user.find({ tgId: userId });

  await fund.updateBalanceBy({ userId, fundId, amount: userData.balance });
  await user.update({ tgId: userId, balance: 0 });
};

accountant.shareBalanceBetweenFundsByPriorities = async (data) => {
  const { userId } = data;
  const userData = await user.find({ tgId: userId });
  const funds = await fund.findAll({ userId });

  let balance = userData.balance;
  const fundsUpdateData = funds
    .sort((a, b) => a.priority - b.priority)
    .map((fund) => {
      const need = fund.capacity;
      const amount = need > balance ? balance : need;

      balance -= amount;

      return {
        userId: userId,
        fundId: fund.id,
        amount,
      };
    });

  await Promise.all(fundsUpdateData.map((data) => fund.updateBalanceBy(data)));
  await user.update({ tgId: userId, balance });
};

accountant.shareBalanceBetweenFundsEqually = async (data) => {
  const { userId } = data;
  const userData = await user.find({ tgId: userId });
  const funds = await fund.findAll({ userId });

  let balance = userData.balance;
  const share = Math.floor(balance / funds.length);
  const fundsUpdateData = funds.map((fund) => {
    return {
      userId: userId,
      fundId: fund.id,
      amount: share,
    };
  });

  await Promise.all(fundsUpdateData.map((data) => fund.updateBalanceBy(data)));
  await user.update({ tgId: userId, balance: 0 });
};

module.exports = accountant;

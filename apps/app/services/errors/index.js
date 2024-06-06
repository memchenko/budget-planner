const { events, mediator } = require("../mediator");

const log = require("../../lib/log");

const user = require("../../entities/user");
const state = require("../../entities/state");
const categories = require("../../entities/categories");
const fund = require("../../entities/fund");
const income = require("../../entities/income");
const cost = require("../../entities/cost");

mediator.on(events.DELETE_USER, ({ tgId }) => {
  Promise.all([
    user.delete({ tgId }),
    state.delete({ userId: tgId }),
    categories.delete({ userId: tgId }),
    fund.deleteAll({ userId: tgId }),
    income.deleteAll({ userId: tgId }),
    cost.deleteAll({ userId: tgId }),
  ])
    .then(() => {
      log.success(`User with id ${tgId} was deleted`);
    })
    .catch((err) => {
      log.error("Couldn't delete user");
      log.error(err);
    });
});

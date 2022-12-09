const Joi = require("joi");
const { DateTime } = require("luxon");
const { omit } = require("lodash");

const { users, read, write, del, readAll } = require("../services/db");
const { EntityManager } = require("../utils/entity-manager");

const userDto = Joi.object({
  tgId: Joi.number(),
  balance: Joi.number(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

const findDto = Joi.object({
  tgId: Joi.number(),
});

const updateDto = Joi.object({
  tgId: Joi.number(),
  balance: Joi.number().optional(),
});

const updateBalanceDto = Joi.object({
  tgId: Joi.number(),
  amount: Joi.number(),
});

module.exports = new EntityManager("user", {
  create: {
    dto: userDto,
    handler: async (data, cb) => {
      try {
        const newUser = {
          ...data,
          createdAt: DateTime.utc().toMillis(),
        };

        await write(String(data.tgId), newUser, users);

        return cb(undefined, newUser);
      } catch (err) {
        return cb(err);
      }
    },
  },

  delete: {
    dto: findDto,
    handler: async (data, cb) => {
      try {
        await del(data.tgId, users);

        return cb(undefined);
      } catch (err) {
        return cb(err);
      }
    },
  },

  find: {
    dto: findDto,
    handler: async (data, cb) => {
      try {
        const result = await read(data.tgId, users);

        return cb(undefined, result);
      } catch (err) {
        return cb(err);
      }
    },
  },

  findAll: {
    handler: async (data, cb) => {
      try {
        const result = await readAll(users);

        return cb(undefined, result);
      } catch (err) {
        return cb(err);
      }
    },
  },

  update: {
    dto: updateDto,
    handler: async function ({ tgId, ...data }, cb) {
      try {
        const user = await this.find({ tgId });
        const cleanData = omit(data, ["tgId", "createdAt", "updatedAt"]);
        const newData = Object.assign(user, cleanData, {
          updatedAt: DateTime.utc().toMillis(),
        });

        await write(tgId, newData, users);

        return cb(undefined, newData);
      } catch (err) {
        return cb(err);
      }
    },
  },

  updateBalance: {
    dto: updateBalanceDto,
    handler: async function ({ tgId, amount }, cb) {
      try {
        const newBalance = Number(amount);
        const updatedUser = await this.update({ tgId, balance: newBalance });

        return cb(undefined, updatedUser);
      } catch (err) {
        return cb(err);
      }
    },
  },

  updateBalanceBy: {
    dto: updateBalanceDto,
    handler: async function ({ tgId, amount }, cb) {
      try {
        const user = await this.find({ tgId });

        const newBalance = Number(user.balance) + amount;
        const updatedUser = await this.update({ tgId, balance: newBalance });

        return cb(undefined, updatedUser);
      } catch (err) {
        return cb(err);
      }
    },
  },
});

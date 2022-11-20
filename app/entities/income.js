const Joi = require("joi");
const { DateTime } = require("luxon");

const { incomes, read, readAll, write, del } = require("../services/db");
const { EntityManager } = require("../utils/entity-manager");

const incomeDto = Joi.object({
  id: Joi.string().optional(),
  userId: Joi.number(),
  note: Joi.string(),
  category: Joi.string(),
  amount: Joi.number(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

const findOneDto = Joi.object({
  id: Joi.string(),
  userId: Joi.number(),
});

const findAllDto = Joi.object({
  userId: Joi.number(),
});

module.exports = new EntityManager("income", {
  create: {
    dto: incomeDto,
    handler: async ({ userId, ...data }, cb) => {
      try {
        const newIncome = {
          ...data,
          id: DateTime.utc().toMillis().toString(),
          createdAt: DateTime.utc().toMillis(),
          updatedAt: DateTime.utc().toMillis(),
        };

        await write(newIncome.id, newIncome, incomes.sublevel(String(userId)));

        return cb(undefined, newIncome);
      } catch (err) {
        return cb(err);
      }
    },
  },

  update: {
    dto: incomeDto,
    handler: async ({ userId, ...data }, cb) => {
      try {
        const updatedIncome = {
          ...data,
          updatedAt: DateTime.utc().toMillis(),
        };

        await write(data.id, updatedIncome, incomes.sublevel(String(userId)));

        return cb(undefined, updatedIncome);
      } catch (err) {
        return cb(err);
      }
    },
  },

  delete: {
    dto: findOneDto,
    handler: async ({ userId, id }, cb) => {
      try {
        const result = await del(id, incomes.sublevel(String(userId)));

        return cb(undefined, result);
      } catch (err) {
        return cb(err);
      }
    },
  },

  find: {
    dto: findOneDto,
    handler: async ({ userId, id }, cb) => {
      try {
        const result = await read(id, incomes.sublevel(String(userId)));

        return cb(undefined, result);
      } catch (err) {
        return cb(err);
      }
    },
  },

  findAll: {
    dto: findAllDto,
    handler: async ({ userId }, cb) => {
      try {
        const result = await readAll(incomes.sublevel(String(userId)));

        return cb(undefined, result);
      } catch (err) {
        return cb(err);
      }
    },
  },
});

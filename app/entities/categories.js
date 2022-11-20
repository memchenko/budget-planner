const Joi = require("joi");
const difference = require("lodash/difference");

const { categories, read, write, del } = require("../services/db");
const { EntityManager } = require("../utils/entity-manager");

const categoriesDto = Joi.object({
  userId: Joi.number(),
  type: Joi.string().valid("cost", "income"),
  list: Joi.array().items(Joi.string()),
});

const findDto = Joi.object({
  userId: Joi.number(),
  type: Joi.string().valid("cost", "income"),
});

module.exports = new EntityManager("categories", {
  add: {
    dto: categoriesDto,
    handler: async function ({ userId, type, ...data }, cb) {
      try {
        const currentValue = await this.find({ userId, type });
        const newList = currentValue
          ? currentValue.concat(data.list)
          : data.list;

        await write(String(userId), newList, categories.sublevel(type));

        return cb(undefined, { userId, type, list: newList });
      } catch (err) {
        return cb(err);
      }
    },
  },

  delete: {
    dto: findDto,
    handler: async ({ userId, type }, cb) => {
      try {
        const result = await del(String(userId), categories.sublevel(type));

        return cb(undefined, result);
      } catch (err) {
        return cb(err);
      }
    },
  },

  remove: {
    dto: categoriesDto,
    handler: async function ({ userId, type, ...data }, cb) {
      try {
        const currentValue = await this.find({ userId, type });
        const newList = currentValue ? difference(currentValue, data.list) : [];

        await write(String(userId), newList, categories.sublevel(type));

        return cb(undefined, { userId, type, list: newList });
      } catch (err) {
        return cb(err);
      }
    },
  },

  find: {
    dto: findDto,
    handler: async ({ userId, type }, cb) => {
      try {
        const result = await read(String(userId), categories.sublevel(type));

        return cb(undefined, result);
      } catch (err) {
        return cb(err);
      }
    },
  },
});

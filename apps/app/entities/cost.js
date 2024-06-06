const Joi = require("joi");
const { DateTime } = require("luxon");

const { costs, read, del, write, readAll } = require("../services/db");
const { EntityManager } = require("../utils/entity-manager");

const costDto = Joi.object({
  id: Joi.string().optional(),
  userId: Joi.number(),
  fundId: Joi.string(),
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
  limit: Joi.number(),
});

const getDB = (userId) => costs.doc(String(userId)).collection("default");

module.exports = new EntityManager("cost", {
  create: {
    dto: costDto,
    handler: async ({ userId, ...data }, cb) => {
      try {
        const newCost = {
          ...data,
          id: DateTime.utc().toMillis().toString(),
          createdAt: DateTime.utc().toMillis(),
          updatedAt: DateTime.utc().toMillis(),
        };

        await write(String(newCost.id), newCost, getDB(userId));

        return cb(undefined, newCost);
      } catch (err) {
        return cb(err);
      }
    },
  },

  update: {
    dto: costDto,
    handler: async ({ userId, ...data }, cb) => {
      try {
        const newCost = {
          ...data,
          updatedAt: DateTime.utc().toMillis(),
        };

        await write(String(data.id), newCost, getDB(userId));

        return cb(undefined, newCost);
      } catch (err) {
        return cb(err);
      }
    },
  },

  delete: {
    dto: findOneDto,
    handler: async ({ userId, id }, cb) => {
      try {
        const result = await del(String(id), getDB(userId));

        return cb(undefined, result);
      } catch (err) {
        return cb(err);
      }
    },
  },

  deleteAll: {
    dto: findAllDto,
    handler: async ({ userId }, cb) => {
      try {
        await del(userId, costs);

        return cb(undefined, true);
      } catch (err) {
        return cb(err);
      }
    },
  },

  find: {
    dto: findOneDto,
    handler: async ({ userId, id }, cb) => {
      try {
        const result = await read(String(id), getDB(userId));

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
        const result = await readAll(getDB(userId));

        return cb(undefined, result);
      } catch (err) {
        return cb(err);
      }
    },
  },
});

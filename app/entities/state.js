const Joi = require("joi");

const { state, read, write, del } = require("../services/db");
const { EntityManager } = require("../utils/entity-manager");

const stateDto = Joi.object({
  userId: Joi.number(),
  state: Joi.string().allow(null),
  responsesList: Joi.array().items(Joi.string()),
});

const findDto = Joi.object({
  userId: Joi.number(),
});

const setStateDto = Joi.object({
  userId: Joi.number(),
  state: Joi.string().allow(null),
});

const addResponseDto = Joi.object({
  userId: Joi.number(),
  response: Joi.string(),
});

module.exports = new EntityManager("state", {
  upsert: {
    dto: stateDto,
    handler: async ({ userId, ...data }, cb) => {
      try {
        await write(userId, data, state);

        return cb(undefined, { userId, ...data });
      } catch (err) {
        return cb(err);
      }
    },
  },

  delete: {
    dto: findDto,
    handler: async ({ userId }, cb) => {
      try {
        const result = await del(userId, state);

        return cb(undefined, result);
      } catch (err) {
        return cb(err);
      }
    },
  },

  find: {
    dto: findDto,
    handler: async ({ userId }, cb) => {
      try {
        const result = await read(userId, state);

        return cb(undefined, result);
      } catch (err) {
        return cb(err);
      }
    },
  },

  setState: {
    dto: setStateDto,
    handler: async function ({ userId, state: newState }, cb) {
      try {
        const currentData = await this.find({ userId });
        const newData = Object.assign(currentData, { state: newState });

        await write(userId, newData, state);

        return cb(undefined, newData);
      } catch (err) {
        return cb(err);
      }
    },
  },

  addResponse: {
    dto: addResponseDto,
    handler: async function ({ userId, response }, cb) {
      try {
        const currentData = await this.find({ userId });
        const newData = Object.assign(currentData, {
          responsesList: currentData.responsesList.concat(response),
        });

        await write(userId, newData, state);

        return cb(undefined, newData);
      } catch (err) {
        return cb(err);
      }
    },
  },

  reset: {
    dto: findDto,
    handler: async ({ userId }, cb) => {
      try {
        const value = { state: null, responsesList: [] };

        await write(userId, value, state);

        return cb(undefined);
      } catch (err) {
        return cb(err);
      }
    },
  },
});

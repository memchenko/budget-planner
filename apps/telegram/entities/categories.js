const Joi = require("joi");
const { DateTime } = require("luxon");

const { categories, write, del, readAll } = require("../services/db");
const { EntityManager } = require("../utils/entity-manager");

const addCategoryDto = Joi.object({
  userId: Joi.number(),
  type: Joi.string().valid("cost", "income"),
  title: Joi.string(),
});

const removeDto = Joi.object({
  id: Joi.string(),
  type: Joi.string().valid("cost", "income"),
  userIs: Joi.number(),
});

const findDto = Joi.object({
  userId: Joi.number(),
  type: Joi.string().valid("cost", "income"),
});

const deleteDto = Joi.object({
  userId: Joi.number(),
});

const getDB = (userId, type) => categories.doc(String(userId)).collection(type);

module.exports = new EntityManager("categories", {
  add: {
    dto: addCategoryDto,
    handler: async function ({ userId, type, title }, cb) {
      try {
        const id = DateTime.utc().toMillis().toString();
        const allCategories = await this.find({ userId, type });
        const isExistingCategory = allCategories.find(
          (category) => category === title
        );

        if (!isExistingCategory) {
          await write(id, { id, title }, getDB(userId, type));
        }

        return cb(undefined, true);
      } catch (err) {
        return cb(err);
      }
    },
  },

  remove: {
    dto: removeDto,
    handler: async function ({ userId, type, id }, cb) {
      try {
        await del(id, getDB(userId, type));

        const newList = this.find({ userId, type });

        return cb(undefined, { userId, type, list: newList });
      } catch (err) {
        return cb(err);
      }
    },
  },

  delete: {
    dto: deleteDto,
    handler: async function ({ userId }, cb) {
      try {
        await del(userId, categories);

        return cb(undefined, true);
      } catch (err) {
        return cb(err);
      }
    },
  },

  find: {
    dto: findDto,
    handler: async ({ userId, type }, cb) => {
      try {
        const result = await readAll(getDB(userId, type));

        return cb(
          undefined,
          result.map((item) => item.title)
        );
      } catch (err) {
        return cb(err);
      }
    },
  },
});

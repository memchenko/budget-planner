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

const findAllDto = Joi.object({
  userId: Joi.number(),
  type: Joi.string().valid("cost", "income"),
});

const getDB = (userId, type) => categories.doc(String(userId)).collection(type);

module.exports = new EntityManager("categories", {
  add: {
    dto: addCategoryDto,
    handler: async function ({ userId, type, title }, cb) {
      try {
        const id = DateTime.utc().toMillis().toString();
        const allCategories = await this.findAll({ userId, type });
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

        const newList = this.findAll({ userId, type });

        return cb(undefined, { userId, type, list: newList });
      } catch (err) {
        return cb(err);
      }
    },
  },

  findAll: {
    dto: findAllDto,
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

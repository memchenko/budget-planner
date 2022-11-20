const Joi = require("joi");
const { promisify } = require("node:util");

const { settings: settingsDb } = require("../services/db");
const { validateDto } = require("../utils/validation");

const entity = {};

const settingsDto = Joi.object({
  userId: Joi.number(),
});

module.exports = entity;

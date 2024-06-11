const { BadRequest } = require("../lib/errors");
const log = require("../lib/log");

module.exports.EntityManager = class EntityManager {
  constructor(name, config) {
    Object.entries(config).forEach(([key, value]) => {
      const { dto, handler } = value;

      this[key] = (data) => {
        log.info(`${name}.${key}: ${JSON.stringify(data)}`);
        return new Promise((resolve, reject) => {
          const validationResult = dto ? dto.validate(data) : { error: null };

          if (validationResult.error) {
            reject(new BadRequest(validationResult.error));
            return;
          }

          handler.call(this, data, (error, value) => {
            if (
              error &&
              error.message &&
              error.message.includes("Key not found in database")
            ) {
              log.info(`${name}.${key}: ${error.message}`);
              resolve(null);
              return;
            }

            if (error) {
              log.error(`${name}.${key}`);
              reject(error);
            } else {
              log.success(`${name}.${key}: ${JSON.stringify(data)}`);
              resolve(value);
            }
          });
        });
      };
    });
  }
};

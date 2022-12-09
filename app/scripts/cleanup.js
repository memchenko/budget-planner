const { rm } = require("../utils/promisified");
const { codebase } = require("../config");

async function removeDB() {
  await rm(codebase.dataPath, {
    recursive: true,
  });
}

async function removeDBArchive() {
  await rm(`${codebase.dataPath}.zip`);
}

async function fullCleanUp() {
  return Promise.all([removeDB(), removeDBArchive()]);
}

module.exports = {
  removeDB,
  removeDBArchive,
  fullCleanUp,
};

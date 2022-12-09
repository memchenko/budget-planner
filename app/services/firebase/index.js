const { createWriteStream, readFileSync, rmSync } = require("node:fs");
const { pipeline } = require("node:stream");
const { execSync } = require("node:child_process");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");

const { codebase, storage: storageConfig } = require("../../config");
const { info, success, error } = require("../../lib/log");

const app = initializeApp({
  credential: applicationDefault(),
  storageBucket: "budget-planner-18047.appspot.com",
  projectId: "budget-planner-18047",
});
const storage = getStorage(app).bucket();

module.exports = {
  app,
  storage,

  downloadBackup: function () {
    info("Downloading data...");

    return new Promise((resolve, reject) => {
      const file = storage.file(storageConfig.dataRef);
      const destination = createWriteStream(`${codebase.dataPath}.zip`);

      pipeline(file.createReadStream(), destination, (err) => {
        if (err && err.message.includes("No such object")) {
          info("There's no data to load");
          return resolve();
        }

        if (err) {
          error("Something went wrong loading data");
          return reject(err);
        }

        execSync(`unzip -o ${codebase.dataPath}.zip`);
        success("Data downloaded successfully!");
        return resolve();
      });
    });
  },

  uploadBackup: function () {
    execSync(`zip -r data.zip data`);

    const file = readFileSync(`${codebase.dataPath}.zip`);
    const array = new Uint8Array(file);
    const ref = storage.file(storageConfig.dataRef);

    return ref.save(array);
  },
};

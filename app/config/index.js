const path = require("node:path");
const fs = require("node:fs");

const {
  TELEGRAM_TOKEN,
  FIREBASE_CREDS_FILENAME,
  FIREBASE_CREDS,
  DATA_REF_PATH,
} = process.env;

const config = {
  codebase: {
    root: path.join(__dirname, "../../"),
    dataPath: path.join(__dirname, "../../data"),
  },
  telegram: {
    token: TELEGRAM_TOKEN,
  },
  firebase: {
    credsFilename: FIREBASE_CREDS_FILENAME,
    creds: FIREBASE_CREDS,
  },
  storage: {
    dataRef: DATA_REF_PATH,
  },
  api: {
    port: 3000,
  },
};

const credsPath = path.join(
  process.cwd(),
  `${config.firebase.credsFilename}.json`
);
fs.writeFileSync(credsPath, config.firebase.creds);
process.env["GOOGLE_APPLICATION_CREDENTIALS"] = credsPath;

module.exports = config;

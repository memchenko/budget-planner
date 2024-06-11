const path = require("node:path");
const fs = require("node:fs");

const {
  TELEGRAM_TOKEN,
  FIREBASE_CREDS_FILENAME,
  FIREBASE_CREDS,
  FIREBASE_PROJECT_ID,
} = process.env;

const config = {
  codebase: {
    root: path.join(__dirname, "../../"),
  },
  telegram: {
    token: TELEGRAM_TOKEN,
  },
  firebase: {
    credsFilename: FIREBASE_CREDS_FILENAME,
    creds: FIREBASE_CREDS,
    projectId: FIREBASE_PROJECT_ID,
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

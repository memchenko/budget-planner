const { uploadBackup } = require("../services/firebase");
const { info, success } = require("../lib/log");

let isBackupInProgress = false;

async function backup() {
  if (isBackupInProgress) {
    return;
  }

  isBackupInProgress = true;

  info("Start backup on demand...");

  await uploadBackup();

  success("Backup is done!");

  isBackupInProgress = false;
}

module.exports = { backup };

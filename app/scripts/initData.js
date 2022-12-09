const { fullCleanUp, removeDBArchive } = require("./cleanup");
const { downloadBackup } = require("../services/firebase");

async function initData() {
  try {
    await fullCleanUp();
  } catch (err) {
    if (!err.message.includes("no such file or directory")) {
      throw err;
    }
  }

  await downloadBackup();
  await removeDBArchive();
}

initData();

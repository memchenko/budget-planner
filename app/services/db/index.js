const { Level } = require("level");
const path = require("node:path");

const dbPath = process.env.DB_PATH || path.join(process.cwd(), "data");

const db = new Level(dbPath, {
  valueEncoding: "json",
});

module.exports.users = db.sublevel("users");
module.exports.funds = db.sublevel("funds");
module.exports.costs = db.sublevel("costs");
module.exports.incomes = db.sublevel("incomes");
// module.exports.settings = db.sublevel("settings");
module.exports.state = db.sublevel("states");
module.exports.categories = db.sublevel("categories");
// to record when a rule is being applied
// export const log = db.sublevel("log");

module.exports.read = async function read(key, fromDb) {
  try {
    const opts = {
      valueEncoding: "json",
    };

    return await fromDb.get(String(key), opts);
  } catch (err) {
    if (err.message.includes("NotFound")) {
      return null;
    }

    throw err;
  }
};

module.exports.readAll = async function readAll(fromDb) {
  try {
    const opts = { valueEncoding: "json" };

    return await fromDb.values(opts).all();
  } catch (err) {
    throw err;
  }
};

module.exports.write = async function write(key, value, toDb) {
  try {
    const opts = { valueEncoding: "json" };

    return await toDb.put(String(key), value, opts);
  } catch (err) {
    throw err;
  }
};

module.exports.del = async function del(key, fromDb) {
  try {
    return await fromDb.del(String(key));
  } catch (err) {
    throw err;
  }
};

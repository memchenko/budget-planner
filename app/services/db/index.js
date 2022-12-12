const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const { firebase } = require("../../config");

const app = initializeApp({
  credential: applicationDefault(),
  projectId: firebase.projectId,
});

const db = getFirestore(app);

const users = db.collection("users");
const funds = db.collection("funds");
const costs = db.collection("costs");
const incomes = db.collection("incomes");
// module.exports.settings = db.sublevel("settings");
const state = db.collection("states");
const categories = db.collection("categories");
// to record when a rule is being applied
// export const log = db.sublevel("log");

const read = async function read(key, fromDb) {
  const doc = await fromDb.doc(String(key)).get();

  if (!doc.exists) {
    return null;
  }

  return doc.data();
};

const readAll = async function readAll(fromDb) {
  const snapshot = await fromDb.get();

  if (snapshot.empty) {
    return [];
  }

  return Promie.all(snapshot.map((doc) => doc.data()));
};

const write = async function write(key, value, toDb) {
  return await toDb.doc(key).set(value);
};

const del = async function del(key, fromDb) {
  return await fromDb.doc(key).delete();
};

module.exports = {
  read,
  readAll,
  write,
  del,

  cached,

  users,
  funds,
  costs,
  incomes,
  state,
  categories,
};

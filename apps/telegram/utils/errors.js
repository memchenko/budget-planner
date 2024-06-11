module.exports.errorsWith =
  (ErrorClass, fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      throw new ErrorClass(err);
    }
  };

module.exports.nullIf = async (ErrorClass, cb) => {
  try {
    return await cb();
  } catch (err) {
    if (err instanceof ErrorClass) {
      return null;
    } else {
      throw err;
    }
  }
};

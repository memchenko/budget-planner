const isNumber = (text) => {
  const str = text.trim();
  const num = Number(str);

  return !isNaN(num) && str.length !== 0;
};

const isInteger = (text) => {
  const str = text.trim();
  const num = Number(str);
  const isValidNumber = isNumber(text);

  return isValidNumber && num % 1 === 0;
};

const isString = (text) => {
  const str = text.trim();

  return str.length !== 0;
};

const isBoolean = (text) => {
  const str = text.trim().toLowerCase();

  return str === "да" || str === "нет";
};

module.exports = {
  isNumber,
  isInteger,
  isString,
  isBoolean,
};

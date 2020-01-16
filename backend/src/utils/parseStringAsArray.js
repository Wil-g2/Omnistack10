module.exports = array => {
  return array.split(",").map(tech => tech.trim());
};

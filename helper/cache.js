const NodeCache = require("node-cache");
const { CACHE } = require("../config");
const cache = new NodeCache({ stdTTL: CACHE.EXPIRY_TIME });

const set = (key, data, expiry = null) => {
  try {
    let result = cache.set(key, data);
    return result;
  } catch (ex) {
    return false;
  }
};

const get = (key) => {
  try {
    const data = cache.get(key);
    return data;
  } catch (ex) {
    return false;
  }
};

const del = (key) => {
  try {
    cache.delete(key);
    return true;
  } catch (ex) {
    return false;
  }
};

module.exports = {
  set,
  get,
  del,
};

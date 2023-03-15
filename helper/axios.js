const axios = require("axios");
const { API_BASE_URL } = require("../config");

const getHandler = async (url) => {
  try {
    const response = await axios.get(API_BASE_URL + url);
    if (response.status == 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

module.exports = {
  getHandler,
};

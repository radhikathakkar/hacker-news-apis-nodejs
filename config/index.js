module.exports = {
  PORT: process.env.PORT || "3000",
  API_BASE_URL: process.env.API_BASE_URL || 'https://hacker-news.firebaseio.com/v0',
  DB: {
    URI: process.env.MONGO_URI || "mongodb://localhost:27017/hacker-news",
  },
  HTTP_STATUS_CODES: {
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500
  },
  CACHE: {
    EXPIRY_TIME: process.env.CACHE_EXPIRY_TIME || 900
  }
};

const { HTTP_STATUS_CODES } = require("../config");
const config = require("../config");

const success = (res, message, data = null) => {
  const response = {
    status: true,
    message,
  };

  if (data) response.data = data;
  res.status(HTTP_STATUS_CODES.OK).send(response);
};

const serverError = (res, error) => {

  res.status(config.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({
    status: false,
    message: error.toString(),
    data: null,
  });
};

const badRequestError = (res, message) => {
  res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
    status: false,
    message,
    data: null,
  });
};

module.exports = {
  success,
  badRequestError,
  serverError,
};

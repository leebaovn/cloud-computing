const { Error } = require('../utils/Error');

exports.handleError = (error, req, res, next) => {
  if (error instanceof Error) {
    res.status(error.getCode()).send(error);
  } else {
    res.status(500).send(new Error({ message: error.message ? error.message : 'server error' }));
  }
};

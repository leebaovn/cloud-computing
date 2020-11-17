const _ = require('lodash');

class Error {
  constructor({ statusCode, message, error }) {
    this.error = error;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date().toTimeString();
    this.level = 'error';
  }

  addField(key, value) {
    this[key] = value;
    return this;
  }

  getCode() {
    return this.statusCode;
  }
}

module.exports = { Error };

class Success {
  constructor({ message, data }) {
    this.data = data;
    this.message = message;
    this.statusCode = 200;
  }

  addField(key, value) {
    this[key] = value;
    return this;
  }
}

module.exports = { Success };

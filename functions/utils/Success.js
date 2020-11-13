class Success {
  constructor(message, data, totalPage) {
    this.data = data;
    this.message = message;
    // this.totalPage = totalPage && totalPage >= 1 ? totalPage : 1;
    this.statusCode = 200;
  }

  addField = (key, value) => {
    this[key] = value;
    return this;
  };
}

module.exports = Success;

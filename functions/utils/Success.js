const _ = require('lodash');

class Success {
    constructor(message, data, totalPage) {
        this.data = data;
        this.message = message;
        this.totalPage = totalPage && totalPage >= 1 ? totalPage : 1;
        this.statusCode = 200;
    }

    addField = (key, value) => {
        _.set('this.' + key, value);
    }
}

module.exports = Success;
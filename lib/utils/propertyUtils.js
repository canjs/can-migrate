'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _preserveQuote = require('./preserveQuote');

var _preserveQuote2 = _interopRequireDefault(_preserveQuote);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  find: function find(obj, propName) {
    return obj.properties.filter(function (p) {
      if (p.key.type === 'Identifier') {
        return p.key.name === propName;
      } else if (p.key.type === 'Literal') {
        return p.key.value === propName;
      }
    })[0];
  },
  rename: function rename(obj, oldName, newName, forceLiteral) {
    var property = this.find(obj, oldName);
    if (property) {
      if (property.key.type === 'Identifier') {
        if (forceLiteral) {
          property.key.value = newName;
          property.key.type = 'Literal';
        } else {
          property.key.name = (0, _preserveQuote2.default)(property.key.name, newName);
        }
      } else if (property.key.type === 'Literal') {
        property.key.value = newName;
      }
    }
  }
};
module.exports = exports['default'];
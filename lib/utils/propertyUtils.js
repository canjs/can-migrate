'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
  rename: function rename(obj, oldName, newName) {
    var property = this.find(obj, oldName);
    if (property) {
      if (property.key.type === 'Identifier') {
        property.key.name = newName;
      } else if (property.key.type === 'Literal') {
        property.key.value = newName;
      }
    }
  }
};
module.exports = exports['default'];
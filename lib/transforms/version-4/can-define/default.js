'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;
function transformer(file, api) {
  var j = api.jscodeshift;
  var root = j(file.source);

  return root.find(j.CallExpression, {
    callee: {
      object: {
        name: 'DefineMap'
      }
    }
  }).forEach(function (expressionStatement) {
    j(expressionStatement).find(j.Identifier, { name: 'value' }).forEach(function (identifier) {
      identifier.node.name = 'default';
    });
  }).toSource();
}
module.exports = exports['default'];
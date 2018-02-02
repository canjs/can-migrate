'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;
function transformer(file, api) {
  var j = api.jscodeshift;
  var root = j(file.source);

  var src = root.find(j.CallExpression, {
    callee: {
      object: {
        name: 'DefineMap'
      }
    }
  }).forEach(function (expressionStatement) {
    j(expressionStatement).find(j.CallExpression, { callee: { object: { type: 'ThisExpression' } } }).forEach(function (expression) {
      expression.value.callee.property.name = 'forEach';
    });
  }).toSource();

  root = j(src);

  src = root.find(j.NewExpression, {
    callee: {
      name: 'DefineList'
    }
  }).forEach(function (expressionStatement) {
    j(expressionStatement).find(j.CallExpression, { callee: { object: { type: 'ThisExpression' } } }).forEach(function (expression) {
      expression.value.callee.property.name = 'forEach';
    });
  }).toSource();

  return src;
}
module.exports = exports['default'];
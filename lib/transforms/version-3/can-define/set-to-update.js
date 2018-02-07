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
      if (expression.value.callee.property.name === 'set') {
        if (expression.node.arguments.length === 2) {
          var firstArg = expression.node.arguments[0];
          var secondArg = expression.node.arguments[1];
          if (firstArg.type === 'ObjectExpression' && typeof secondArg.value === 'boolean') {
            expression.node.arguments.splice(-1);
          }
        }
        expression.value.callee.property.name = 'update';
      }
    });
  }).toSource();

  root = j(src);

  src = root.find(j.NewExpression, {
    callee: {
      name: 'DefineList'
    }
  }).forEach(function (expressionStatement) {
    j(expressionStatement).find(j.CallExpression, { callee: { object: { type: 'ThisExpression' } } }).forEach(function (expression) {
      if (expression.value.callee.property.name === 'set') {
        if (expression.node.arguments.length === 2) {
          var firstArg = expression.node.arguments[0];
          var secondArg = expression.node.arguments[1];
          if (firstArg.type === 'ArrayExpression' && typeof secondArg.value === 'boolean') {
            expression.node.arguments.splice(-1);
          }
        }
        expression.value.callee.property.name = 'update';
      }
    });
  }).toSource();

  return src;
}
module.exports = exports['default'];
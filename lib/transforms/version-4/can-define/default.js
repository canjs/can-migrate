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
  }).forEach(function (path) {
    var propDefinitionsArg = path.value.arguments.length === 1 ? path.value.arguments[0] : path.value.arguments[1];

    // loop through each PropDefinition
    // passed to the first argument of DefineMap.extend
    propDefinitionsArg.properties.forEach(function (propDefinition) {
      if (propDefinition.value.type === 'ObjectExpression') {
        propDefinition.value.properties.forEach(function (behavior) {
          if (behavior.key.name === 'value') {
            behavior.key.name = 'default';
          }
        });
      }
    });
  }).toSource();
}
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _dependencyUtils = require('../../../utils/dependencyUtils');

var _dependencyUtils2 = _interopRequireDefault(_dependencyUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(file, api) {
  var path = file.path;
  var type = path.slice(path.lastIndexOf('.') + 1);
  var j = api.jscodeshift;
  var root = j(file.source);

  if (type === 'js') {
    var routeImportVariable = '';

    // find the name for the can-route import, ie 'canRoute' in:
    // 'import canRoute from 'can-route';
    _dependencyUtils2.default.find(root, ['can-route/can-route', 'can-route']).find(j.ImportDefaultSpecifier).forEach(function (foo) {
      routeImportVariable = foo.value.local.name;
    });

    // find all the places that function is called
    root.find(j.CallExpression, {
      callee: {
        name: routeImportVariable
      }
    })
    // modify the templated pieces of the rule (the first argument)
    // :foo -> {foo}
    .forEach(function (statement) {
      var args = statement.parent.value.expression.arguments;
      var rule = args[0];
      rule.value = rule.value.replace(/:([a-zA-Z]*)/g, '\{$1\}');
    });
  }

  return root.toSource();
}
module.exports = exports['default'];
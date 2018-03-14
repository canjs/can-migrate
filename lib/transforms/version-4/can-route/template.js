'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _dependencyUtils = require('../../../utils/dependencyUtils');

var _dependencyUtils2 = _interopRequireDefault(_dependencyUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var updateTemplatedRules = function updateTemplatedRules(statement) {
  var parent = statement.parent;
  var args = parent.value.type === 'CallExpression' ?
  // route.register(...)
  parent.parent.value.expression.arguments :
  // route(...)
  parent.value.expression.arguments;
  var rule = args[0];
  rule.value = rule.value.replace(/:([a-zA-Z]*)/g, '\{$1\}');
};

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

    // find all canRoute(...) calls
    root.find(j.CallExpression, {
      callee: {
        name: routeImportVariable
      }
    })
    // modify the templated pieces of the rule (the first argument)
    // :foo -> {foo}
    .forEach(updateTemplatedRules);

    // find all canRoute.register(...) calls
    root.find(j.MemberExpression, {
      object: {
        name: routeImportVariable
      },
      property: {
        name: 'register'
      }
    }).forEach(updateTemplatedRules);
  }

  return root.toSource();
}
module.exports = exports['default'];
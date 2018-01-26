'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _getConfig = require('../../../utils/getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

var _dependencyUtils = require('../../../utils/dependencyUtils');

var _dependencyUtils2 = _interopRequireDefault(_dependencyUtils);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(file, api, options) {
  var debug = (0, _debug2.default)('can-migrate:can-extend:' + file.path);
  var config = (0, _getConfig2.default)(options.config);
  var j = api.jscodeshift;
  var printOptions = options.printOptions || {};
  var root = j(file.source);
  root.find(j.MemberExpression, {
    object: {
      name: 'can'
    },
    property: {
      name: 'extend'
    }
  }).filter(function (statement) {
    return statement.parent.parent.value.type === 'ExpressionStatement';
  }).forEach(function (statement) {
    var args = statement.parent.parent.value.expression.arguments;
    var funcName = void 0;
    var sourceValue = void 0;
    if (args[0].type === 'Literal' && typeof args[0].value === 'boolean') {
      debug('First argument to can.extend is ' + args[0].value);
      sourceValue = args[0].value ? 'can-util/js/deep-assign/deep-assign' : 'can-util/js/assign/assign';
      args.splice(0, 1);
    } else {
      sourceValue = 'can-util/js/assign/assign';
    }
    funcName = config.moduleToName[sourceValue];
    debug('Replacing can.extend with ' + funcName + ' from ' + sourceValue);
    _dependencyUtils2.default.add(root, sourceValue, funcName, ['can', 'can/can', 'can/can.js']);
    j(statement).replaceWith(j.identifier(funcName));
  });
  return root.toSource(printOptions);
} // This is a generated file, see src/templates/can-extend/can-extend.js
module.exports = exports['default'];
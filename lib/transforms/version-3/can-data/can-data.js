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
  var debug = (0, _debug2.default)('can-migrate:can-data:' + file.path);
  var config = (0, _getConfig2.default)(options.config);
  var j = api.jscodeshift;
  var printOptions = options.printOptions || {};
  var root = j(file.source);
  root.find(j.MemberExpression, {
    object: {
      name: 'can'
    },
    property: {
      name: 'data'
    }
  }).filter(function (statement) {
    return statement.parent.parent.value.type === 'ExpressionStatement';
  }).forEach(function (statement) {
    var args = statement.parent.parent.value.expression.arguments;
    var sourceValue = 'can-util/dom/data/data';
    var dataName = void 0;
    var funcName = void 0;
    if (args.length === 3) {
      funcName = 'set';
    } else if (args.length === 2) {
      funcName = 'get';
    }
    debug(args.length + ' arguments passed to can.data -> ' + funcName);
    dataName = config.moduleToName[sourceValue];
    debug('Replacing can.data with ' + dataName + '.' + funcName + '.call');
    _dependencyUtils2.default.add(root, sourceValue, dataName, ['can', 'can/can', 'can/can.js']);
    j(statement).replaceWith(j.memberExpression(j.memberExpression(j.identifier(dataName), j.identifier(funcName)), j.identifier('call')));
  });
  return root.toSource(printOptions);
} // This is a generated file, see src/templates/can-extend/can-extend.js
module.exports = exports['default'];
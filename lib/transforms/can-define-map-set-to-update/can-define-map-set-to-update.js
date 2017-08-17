'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(file, api, options) {
  var debug = (0, _debug2.default)('can-migrate:can-define-map-set-to-update:' + file.path);
  var j = api.jscodeshift;
  var printOptions = options.printOptions || {};
  var root = j(file.source);
  var setCalls = root.find(j.CallExpression, {
    callee: {
      property: {
        name: 'set'
      }
    }
  });

  setCalls.forEach(function (statement) {
    console.log(statement.node.arguments);
    if (statement.node.arguments.length === 2) {
      var firstArg = statement.node.arguments[0];
      var secondArg = statement.node.arguments[1];

      if (firstArg.type === 'ObjectExpression' && typeof secondArg.rawValue === 'boolean') {
        debug('Replacing .set with .update from .set');
        statement.node.callee.property.name = 'update';
        statement.node.arguments.splice(-1);
      }
    }
  });
  return root.toSource(printOptions);
} // This is a generated file, see src/templates/can-extend/can-extend.js
module.exports = exports['default'];
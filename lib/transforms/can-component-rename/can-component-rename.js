'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _getConfig = require('../../utils/getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

var _propertyUtils = require('../../utils/propertyUtils');

var _propertyUtils2 = _interopRequireDefault(_propertyUtils);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(file, api, options) {
  var debug = (0, _debug2.default)('can-migrate:can-component-rename:' + file.path);
  var config = (0, _getConfig2.default)(options.config);
  var j = api.jscodeshift;
  var printOptions = options.printOptions || {};
  var componentName = config.moduleToName['can-component'];
  var root = j(file.source);
  root.find(j.CallExpression).filter(function (expression) {
    // can.Component
    if (expression.value.callee && expression.value.callee.object) {
      if (expression.value.callee.object.type === 'MemberExpression') {
        return expression.value.callee.object.property.name === 'Component';
      } else {
        return expression.value.callee.object.name === componentName;
      }
    }
  }).forEach(function (expression) {
    var eventsProp = _propertyUtils2.default.find(expression.value.arguments[0], 'events');
    debug('Renaming \'template\' -> \'view\'');
    _propertyUtils2.default.rename(expression.value.arguments[0], 'template', 'view');
    if (eventsProp) {
      debug('Renaming \'removed\' -> \'beforeremove\'');
      _propertyUtils2.default.rename(eventsProp.value, 'removed', '{element} beforeremove', true);
    }
  });
  return root.toSource(printOptions);
} // This is a generated file, see src/templates/can-extend/can-extend.js
module.exports = exports['default'];
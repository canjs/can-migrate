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
  var debug = (0, _debug2.default)('can-migrate:can-view-attr-replace:' + file.path);
  var config = (0, _getConfig2.default)(options.config);
  var j = api.jscodeshift;
  var printOptions = options.printOptions || {};
  var root = j(file.source);
  var found = false;
  var newName = config.moduleToName['can-view-callbacks'];

  debug('Finding all instances of \'can.view.attr\'');
  root.find(j.MemberExpression).filter(function (expression) {
    var match = true;

    if (expression.value.object.property) {
      var parts = 'can.view'.split('.');
      var objectName = parts[0];
      var objectProp = parts[1];
      // Figure out if the nested object matches
      match = match && expression.value.object.object.name === objectName && expression.value.object.property.name === objectProp;
    } else {
      return false;
    }

    return match && expression.value.property.name === 'attr';
  }).forEach(function (expression) {
    debug('Replacing all instances of \'can.view.attr\' with \'' + newName + '.attr\'');
    found = true;

    // can.event.addEvent -> canEvent.addEventListener
    j(expression).replaceWith(j.memberExpression(j.identifier(newName), j.identifier('attr')));
  });

  if (found) {
    _dependencyUtils2.default.add(root, 'can-view-callbacks', newName, ['can', 'can/', 'can/can', 'can/can.js']);
  }
  return root.toSource(printOptions);
} // This is a generated file, see src/templates/replace/replace.ejs
module.exports = exports['default'];
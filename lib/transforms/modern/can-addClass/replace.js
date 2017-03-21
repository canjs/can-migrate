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
  var debug = (0, _debug2.default)('can-migrate:can-addClass-replace:' + file.path);
  var config = (0, _getConfig2.default)(options.config);
  var j = api.jscodeshift;
  var printOptions = options.printOptions || {};
  var root = j(file.source);
  var found = false;
  var newName = config.moduleToName['can-util/dom/class-name/class-name'];

  debug('Finding all instances of \'can.addClass\'');
  root.find(j.MemberExpression).filter(function (expression) {
    var match = true;

    match = match && expression.value.object.name === 'can';

    return match && expression.value.property.name === 'addClass';
  }).forEach(function (expression) {
    debug('Replacing all instances of \'can.addClass\' with \'' + newName + '.addClass.call\'');
    found = true;

    // can.event.addEvent -> canEvent.addEventListener
    j(expression).replaceWith(j.memberExpression(j.identifier(newName), j.identifier('addClass.call')));
  });

  if (found) {
    _dependencyUtils2.default.add(root, 'can-util/dom/class-name/class-name', newName, ['can', 'can/', 'can/can', 'can/can.js']);
  }
  return root.toSource(printOptions);
} // This is a generated file, see src/templates/replace/replace.ejs
module.exports = exports['default'];
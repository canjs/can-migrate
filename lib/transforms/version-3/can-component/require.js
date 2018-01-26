'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _getConfig = require('../../utils/getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

var _renameRequire = require('../../utils/renameRequire');

var _renameRequire2 = _interopRequireDefault(_renameRequire);

var _replaceRefs = require('../../utils/replaceRefs');

var _replaceRefs2 = _interopRequireDefault(_replaceRefs);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This is a generated file, see src/templates/require/require.ejs
function transformer(file, api, options) {
  var debug = (0, _debug2.default)('can-migrate:can-component-require:' + file.path);
  var config = (0, _getConfig2.default)(options.config);
  var newLocalName = config.moduleToName['can-component'];
  var j = api.jscodeshift;
  var printOptions = options.printOptions || {};
  var root = j(file.source);
  var oldLocalName = (0, _renameRequire2.default)(root, {
    oldSourceValues: ['can/component/', 'can/component/component', 'can/component/component.js'],
    newSourceValue: 'can-component',
    newLocalName: newLocalName
  });
  if (oldLocalName) {
    debug('Replacing all occurences of ' + oldLocalName + ' with ' + newLocalName);
    (0, _replaceRefs2.default)(j, root, {
      oldLocalName: oldLocalName,
      newLocalName: newLocalName
    });
  }
  return root.toSource(printOptions);
}
module.exports = exports['default'];
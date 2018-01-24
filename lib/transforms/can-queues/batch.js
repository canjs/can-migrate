'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _getConfig = require('../../utils/getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

var _renameImport = require('../../utils/renameImport');

var _renameImport2 = _interopRequireDefault(_renameImport);

var _renameRequire = require('../../utils/renameRequire');

var _renameRequire2 = _interopRequireDefault(_renameRequire);

var _replaceRefs = require('../../utils/replaceRefs');

var _replaceRefs2 = _interopRequireDefault(_replaceRefs);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(file, api, options) {
  var debug = (0, _debug2.default)('can-migrate:can-view-scope-import:' + file.path);
  var config = (0, _getConfig2.default)(options.config);
  var newLocalName = config.moduleToName['can-queues'];
  var printOptions = options.printOptions || {};
  var j = api.jscodeshift;
  var root = j(file.source);

  var doRename = function doRename(renameFn) {
    var oldLocalName = renameFn(root, {
      oldSourceValues: ['can-event/batch/batch'],
      newSourceValue: 'can-queues',
      newLocalName: newLocalName
    });
    if (oldLocalName) {
      debug('Replacing all occurences of ' + oldLocalName + ' with ' + newLocalName);
      (0, _replaceRefs2.default)(j, root, {
        oldLocalName: oldLocalName,
        newLocalName: newLocalName + '.batch'
      });
    }
  };

  // ESM
  doRename(_renameImport2.default);

  // CJS
  doRename(_renameRequire2.default);

  return root.toSource(printOptions);
}
module.exports = exports['default'];
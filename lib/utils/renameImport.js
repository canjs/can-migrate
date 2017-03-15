'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replaceImport;

var _importUtils = require('./importUtils');

var _importUtils2 = _interopRequireDefault(_importUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function replaceImport(ast, options) {
  if (!options.oldSourceValues || !options.newSourceValue) {
    return;
  }
  var oldLocalName = void 0;
  _importUtils2.default.find(ast, options.oldSourceValues).forEach(function (importStatement) {
    oldLocalName = _importUtils2.default.rename(importStatement, options.newSourceValue, options.newLocalName);
  });
  return oldLocalName;
} /**
   * Utility for replacing an import statement of the form:
   *   `import <oldLocalName> from <oldSourceValue>
   * Then it replaces references of <oldLocalName> with the new local name.
   * 
   * Options:
   *   oldSourceValues {Array<String>} possible values for <oldSourceValue>
   *   newSourceValue {String} new source value to use (will replace <oldSourceValue>)
   *   newLocalName {String} new local name (will replace <oldLocalName>)
   */
module.exports = exports['default'];
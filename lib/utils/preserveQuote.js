'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = preserveQuote;

var _jsesc = require('jsesc');

var _jsesc2 = _interopRequireDefault(_jsesc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function preserveQuote(raw, newStr) {
  var quote = raw[0];
  if (quote !== '\'' || quote !== '"') {
    return newStr;
  }
  var value = (0, _jsesc2.default)(newStr, { quotes: quote === '\'' ? 'single' : 'double' });
  var literal = quote + value + quote;
  return new String(literal); // jshint ignore:line
} /**
   * Utility for creating a new string with the same quotes as the old string.
   * Uses the approach explained here:
   * https://github.com/benjamn/recast/issues/171#issuecomment-224996336
   *
   * Options:
   *   oldSourceValues {Array<String>} possible values for <oldSourceValue>
   *   newSourceValue {String} new source value to use (will replace <oldSourceValue>)
   *   newLocalName {String} new local name (will replace <oldLocalName>)
   */
module.exports = exports['default'];
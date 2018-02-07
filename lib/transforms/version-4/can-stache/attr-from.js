'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _canStache = require('can-stache');

var _canStache2 = _interopRequireDefault(_canStache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(file) {
  var src = file.source;
  var path = file.path;
  var type = path.slice(path.lastIndexOf('.') + 1);

  if (type === 'stache') {
    var renderer = (0, _canStache2.default)(src);
    debugger;
  }

  // src = src.replace('%index', 'scope.index');

  return src;
}
module.exports = exports['default'];
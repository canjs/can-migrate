'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;
function transformer(file) {
  var src = file.source;
  var path = file.path;
  var type = path.slice(path.lastIndexOf('.') + 1);

  if (type === 'js') {
    src = src.replace(':page', '{page}');
  }

  return src;
}
module.exports = exports['default'];
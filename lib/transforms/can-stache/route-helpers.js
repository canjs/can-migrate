'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;
function transformer(file) {
  var src = file.source;
  var path = file.path;
  var type = path.slice(path.lastIndexOf('.') + 1);

  if (type === 'js' || type === 'stache') {
    src = src.replace('can-stache/helpers/route', 'can-stache-route-helpers');
  }

  return src;
}
module.exports = exports['default'];
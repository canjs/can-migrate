'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;
function transformer(file) {
  var src = file.source;

  src = src.replace('can-stache/helpers/route', 'can-stache-route-helpers');

  return src;
}
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;
function transformer(file) {
  var src = file.source;

  src = src.replace('{{log}}', '{{console.log(this)}}');

  return src;
}
module.exports = exports['default'];
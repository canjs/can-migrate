'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;
function transformer(file) {
  var src = file.source;

  src = src.replace('%index', 'scope.index');
  src = src.replace('%key', 'scope.key');
  src = src.replace('%element', 'scope.element');
  src = src.replace('%event', 'scope.event');
  src = src.replace('%viewModel', 'scope.viewModel');
  src = src.replace('%arguments', 'scope.arguments');

  return src;
}
module.exports = exports['default'];
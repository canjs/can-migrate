'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var transformStache = function transformStache(src) {
  src = src.replace('%index', 'scope.index');
  src = src.replace('%key', 'scope.key');
  src = src.replace('%element', 'scope.element');
  src = src.replace('%event', 'scope.event');
  src = src.replace('%viewModel', 'scope.viewModel');
  src = src.replace('%arguments', 'scope.arguments');

  return src;
};

function transformer(file) {
  var src = file.source;

  src = transformStache(src);

  return src;
}
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _scope = require('../can-stache/scope');

var _scope2 = _interopRequireDefault(_scope);

var _page = require('../can-route/page');

var _page2 = _interopRequireDefault(_page);

var _register = require('../can-route/register');

var _register2 = _interopRequireDefault(_register);

var _routeHelpers = require('../can-stache/route-helpers');

var _routeHelpers2 = _interopRequireDefault(_routeHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(file) {
  var src = file.source;

  src = (0, _scope2.default)(src);
  src = (0, _page2.default)(src);
  src = (0, _register2.default)(src);
  src = (0, _routeHelpers2.default)(src);

  return src;
}
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getConfig;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _config = require('../../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getConfig() {
  var configPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var config = {};
  if (configPath) {
    config = _fsExtra2.default.readJsonSync(configPath);
  }
  return (0, _deepAssign2.default)(_config2.default, config);
} /**
   * Utility for getting the current config
   */
module.exports = exports['default'];
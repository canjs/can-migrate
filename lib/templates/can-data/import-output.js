'use strict';

var _data = require('can-util/dom/data/data');

var _data2 = _interopRequireDefault(_data);

var _can = require('can');

var _can2 = _interopRequireDefault(_can);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_data2.default.set.call(el, 'name', 'Luke');
_data2.default.get.call(el, 'name');
'use strict';

var domData = require('can-util/dom/data/data');
var can = require('can');

domData.set.call(el, 'name', 'Luke');
domData.get.call(el, 'name');
const domData = require('can-util/dom/data/data');
const can = require('can');

domData.set.call(el, 'name', 'Luke');
domData.get.call(el, 'name');

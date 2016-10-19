import domData from 'can-util/dom/data/data';
import can from 'can';

domData.set.call(el, 'name', 'Luke');
domData.get.call(el, 'name');

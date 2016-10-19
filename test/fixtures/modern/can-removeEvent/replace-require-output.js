const canEvent = require('can-event');
const can = require('can');

canEvent.removeEventListener();
canEvent.removeEventListener = false;

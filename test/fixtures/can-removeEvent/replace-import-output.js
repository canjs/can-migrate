import canEvent from 'can-event';
import can from 'can/';

canEvent.removeEventListener();
canEvent.removeEventListener = false;

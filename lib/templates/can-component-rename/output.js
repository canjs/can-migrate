'use strict';

Component.extend({
  tag: 'my-tag',
  view: 'Hi',
  events: {
    beforeremove: function beforeremove() {}
  }
});

can.Component.extend({
  tag: 'my-tag',
  view: 'Hi',
  events: {
    beforeremove: function beforeremove() {}
  }
});

Component.extend({
  tag: 'my-tag',
  events: {
    'beforeremove': function beforeremove() {}
  }
});
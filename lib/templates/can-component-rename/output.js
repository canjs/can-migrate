'use strict';

Component.extend({
  tag: 'my-tag',
  view: 'Hi',
  events: {
    '{element} beforeremove': function elementBeforeremove() {}
  }
});

can.Component.extend({
  tag: 'my-tag',
  view: 'Hi',
  events: {
    '{element} beforeremove': function elementBeforeremove() {}
  }
});

Component.extend({
  tag: 'my-tag',
  events: {
    '{element} beforeremove': function elementBeforeremove() {}
  }
});
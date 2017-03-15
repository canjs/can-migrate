'use strict';

Component.extend({
  tag: 'my-tag',
  template: 'Hi',
  events: {
    removed: function removed() {}
  }
});

can.Component.extend({
  tag: 'my-tag',
  template: 'Hi',
  events: {
    removed: function removed() {}
  }
});

Component.extend({
  tag: 'my-tag',
  events: {
    'removed': function removed() {}
  }
});
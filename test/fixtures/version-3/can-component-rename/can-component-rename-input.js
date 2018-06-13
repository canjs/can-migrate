import template from "foo";

Component.extend({
  tag: 'my-tag',
  template: 'Hi',
  events: {
    removed: function(){}
  }
});

can.Component.extend({
  tag: 'my-tag',
  template: 'Hi',
  events: {
    removed(){}
  }
});

Component.extend({
  tag: 'my-tag',
  events: {
    'removed': () => {}
  },
  leakScope: true
});

Component.extend({
  tag: 'my-tag',
  template: template
});

Component.extend({
  tag: 'my-tag',
  template
});

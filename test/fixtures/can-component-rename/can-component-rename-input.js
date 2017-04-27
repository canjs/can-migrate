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
  }
});

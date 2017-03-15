Component.extend({
  tag: 'my-tag',
  view: 'Hi',
  events: {
    beforeremove: function(){}
  }
});

can.Component.extend({
  tag: 'my-tag',
  view: 'Hi',
  events: {
    beforeremove(){}
  }
});

Component.extend({
  tag: 'my-tag',
  events: {
    'beforeremove': () => {}
  }
});

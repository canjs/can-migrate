Component.extend({
  tag: 'my-tag',
  view: 'Hi',
  events: {
    '{element} beforeremove': function(){}
  }
});

can.Component.extend({
  tag: 'my-tag',
  view: 'Hi',
  events: {
    '{element} beforeremove'(){}
  }
});

Component.extend({
  tag: 'my-tag',
  events: {
    '{element} beforeremove': () => {}
  }
});

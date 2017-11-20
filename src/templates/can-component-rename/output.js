Component.extend({
  tag: 'my-tag',
  view: 'Hi',

  events: {
    '{element} beforeremove': function(){}
  },

  leakScope: true
});

can.Component.extend({
  tag: 'my-tag',
  view: 'Hi',

  events: {
    '{element} beforeremove'(){}
  },

  leakScope: true
});

Component.extend({
  tag: 'my-tag',

  events: {
    '{element} beforeremove': () => {}
  },

  leakScope: true
});

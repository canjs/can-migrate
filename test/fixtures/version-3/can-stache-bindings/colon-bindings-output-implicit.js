Component.extend({
  tag: 'my-tag',
  template: stache(
    '<input value:to="H1" value:from="H2" value:bind="H3" on:value="H4" ' +
    'value:to="H1" value:from="H2" value:bind="H3" on:value="H4" ' +
    'value:from="H1" value:bind="H2" on:click="H3">'
  )
});

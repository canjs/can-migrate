Component.extend({
  tag: 'my-tag',
  template: stache(
    '<input el:value:to="H1" el:value:from="H2" el:value:bind="H3" on:el:value="H4" ' +
    'vm:value:to="H1" vm:value:from="H2" vm:value:bind="H3" on:vm:value="H4">'
  )
});

Component.extend({
  tag: 'my-tag',
  template: stache(
    '<input value:to="H1" value:from="H2" value:bind="H3" on:value="H4" ' +
    'value:to="H1" value:from="H2" value:bind="H3" on:value="H4" ' +
    'value:from="H1" on:click="H3(this, %jQueryElement, %event)" ' +
    'on:hover="H5(this, %jQueryElement, %event)" on:enter="H4(foo, bar=\'baz\' thud=quux)">' +
    '<input value:bind="H1">' +
    '<input type="checkbox" checked:bind="H2" />' +
    '<input type="checkbox" checked:bind="either-or(H3, \'Y\', \'N\')"/>' +
    '<input type="radio" checked:bind="H4" />' +
    '<input type="radio" value="thisOne" checked:bind="equal(H5, \'thisOne\')" />'
  )
});

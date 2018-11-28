```html
<input value:to="H1" value:from="H2" value:bind="H3" on:value="H4"
  value:to="H1" value:from="H2" value:bind="H3" on:value="H4">
```

```js
Component.extend( {
	tag: "my-tag",
	template: stache(
		"<input value:to=\"H1\" value:from=\"H2\" value:bind=\"H3\" on:value=\"H4\" " +
    "value:to=\"H1\" value:from=\"H2\" value:bind=\"H3\" on:value=\"H4\">"
	)
} );
```

```javascript
Component.extend( {
	tag: "my-tag",
	template: stache(
		"<input value:to=\"H1\" value:from=\"H2\" value:bind=\"H3\" on:value=\"H4\" " +
    "value:to=\"H1\" value:from=\"H2\" value:bind=\"H3\" on:value=\"H4\">"
	)
} );
```

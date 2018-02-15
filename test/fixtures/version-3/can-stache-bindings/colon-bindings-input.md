```html
<input {^$value}="H1" {$value}="H2" {($value)}="H3" ($value)="H4"
  {^value}="H1" {value}="H2" {(value)}="H3" (value)="H4">
```

```js
Component.extend( {
	tag: "my-tag",
	template: stache(
		"<input {^$value}=\"H1\" {$value}=\"H2\" {($value)}=\"H3\" ($value)=\"H4\" " +
    "{^value}=\"H1\" {value}=\"H2\" {(value)}=\"H3\" (value)=\"H4\">"
	)
} );
```

const Singleton = DefineMap.extend({
  foo: "number",
}),
singleton = new Singleton({
  foo: 2
});

var Foo = DefineMap.extend({
  foo: "number",
}),
foo = new Foo({
  foo: 2
});

/**
 * @prop
 */
var Bar = DefineMap.extend({
  foo: "number",
}),
/**
 * @prop
 */
Bar = new Bar({
  foo: 2
});

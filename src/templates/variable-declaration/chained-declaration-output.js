const Singleton = DefineMap.extend({
  foo: "number",
});

const singleton = new Singleton({
  foo: 2
});

var Foo = DefineMap.extend({
  foo: "number",
});

var foo = new Foo({
  foo: 2
});

/**
 * @prop
 */
var Bar = DefineMap.extend({
  foo: "number",
});

/**
 * @prop
 */
var Bar = new Bar({
  foo: 2
});

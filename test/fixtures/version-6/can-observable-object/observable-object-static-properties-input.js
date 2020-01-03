const Todo = DefineMap.extend('Foo', { bar: 'Bar', seal: false}, {
  foo: "number"
});

const MyTodo = DefineMap.extend({ bar: 'Bar', seal: false}, {
  foo: "number"
});

const MyOtherTodo = DefineMap.extend('Foo', {
  foo: "number"
});

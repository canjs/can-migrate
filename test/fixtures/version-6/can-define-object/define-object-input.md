```js
const Foo = DefineMap.extend({
  name: 'string',
  completed: {
    type: 'boolean',
    default: false
  }
});
```

```js
const VM = DefineMap.extend({
  firstName: 'string',
  lastName: 'string',
  age: 'number',

  addAge (age) {
    this.age = age;
  },

  get fullName () {
    return `${firstName} ${lastName}`
  }
});
```
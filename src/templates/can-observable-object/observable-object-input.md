```js
// Comment line should not be removed
const Foo = DefineMap.extend({
  name: 'string',
  completed: {
    type: 'boolean',
    default: false
  }
});
```

```js
/**
 * Comment Block should not be removed
 * Foo bar
 */
//foo
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

```js
export default DefineMap.extend({
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

```js
export default DefineMap.extend('MyMap', {
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

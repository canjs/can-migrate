```js
// Comment line should not be removed
class Foo extends ObservableObject {
  static get props() {
    return {
      name: 'string',
      completed: {
        type: 'boolean',
        default: false
      }
    };
  }

  static seal = true;
}
```

```js
/**
 * Comment Block should not be removed
 * Foo bar
 */
//foo
class VM extends ObservableObject {
  static get props() {
    return {
      firstName: 'string',
      lastName: 'string',
      age: 'number',

      addAge (age) {
        this.age = age;
      },

      get fullName () {
        return `${firstName} ${lastName}`
      }
    };
  }

  static seal = true;
}
```

```js
export default class Model extends ObservableObject {
  static get props() {
    return {
      firstName: 'string',
      lastName: 'string',
      age: 'number',

      addAge (age) {
        this.age = age;
      },

      get fullName () {
        return `${firstName} ${lastName}`
      }
    };
  }

  static seal = true;
}
```

```js
export default class MyMap extends ObservableObject {
  static get props() {
    return {
      firstName: 'string',
      lastName: 'string',
      age: 'number',

      addAge (age) {
        this.age = age;
      },

      get fullName () {
        return `${firstName} ${lastName}`
      }
    };
  }

  static seal = true;
}
```

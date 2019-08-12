```js
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
}
```

```js
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
}
```
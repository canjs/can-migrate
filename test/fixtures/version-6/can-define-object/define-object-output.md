```js
class Foo extends DefineObject {
  static get define() {
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
class VM extends DefineObject {
  static get define() {
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
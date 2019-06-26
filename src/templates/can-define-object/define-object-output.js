class Foo extends DefineObject {
  static define() {
    return {
      name: 'string',
      completed: {
        type: 'boolean',
        default: false
      }
    };
  }
}

class VM extends DefineObject {
  static define() {
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

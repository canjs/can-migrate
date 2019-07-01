class Bar extends DefineObject {
  static get define() {
    return {
      '*': {
        enumerable: false
      }
    };
  }
};

class Foo extends DefineObject {
  static get define() {
    return {
      '*': {
        enumerable: false
      },
      name: 'string',
      list: {
        type: Array
      }
    };
  }
};

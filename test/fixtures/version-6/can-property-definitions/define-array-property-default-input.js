class Bar extends DefineArray {
  static get define() {
    return {
      '#': Item,
      items: {
        type: Array,
        default: Array
      },
      name: 'string'
    };
  }
};

class Foo extends DefineObject {
  static get define() {
    return {
      '#': Item,
      items: {
        type: Array,
        default: Array
      },
      name: 'string'
    };
  }
};

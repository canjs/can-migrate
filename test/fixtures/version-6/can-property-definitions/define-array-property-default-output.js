class Bar extends DefineArray {
  static get define() {
    return {
      items: {
        type: Array,
        default: Array
      },

      name: 'string'
    };
  }

  static get items() {
    return Item;
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
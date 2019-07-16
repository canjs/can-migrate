class Bar extends ObservableArray {
  static get props() {
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

class Foo extends ObservableObject {
  static get props() {
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
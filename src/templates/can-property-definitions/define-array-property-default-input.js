class Bar extends ObservableArray {
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

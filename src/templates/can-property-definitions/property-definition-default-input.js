class Bar extends ObservableObject {
  static get props() {
    return {
      '*': {
        enumerable: false
      }
    };
  }
};

class Foo extends ObservableObject {
  static get props() {
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

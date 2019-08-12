class Bar extends ObservableObject {
  static get props() {
    return {};
  }

  static get propertyDefaults() {
    return {
      enumerable: false
    };
  }
};

class Foo extends ObservableObject {
  static get props() {
    return {
      name: 'string',

      list: {
        type: Array
      }
    };
  }

  static get propertyDefaults() {
    return {
      enumerable: false
    };
  }
};
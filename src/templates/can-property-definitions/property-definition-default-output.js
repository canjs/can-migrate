class Bar extends DefineObject {
  static get define() {
    return {};
  }

  static get propertyDefaults() {
    return {
      enumerable: false
    };
  }
};

class Foo extends DefineObject {
  static get define() {
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
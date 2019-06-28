class Foo extends DefineArray {
  static get define() {
    return {
      name: 'string',
      date: 'date',
      success: 'boolean',
      completed: {
        type: 'boolean',
        default: false
      },
      items: 'any'
    };
  }

  get foo () {
  }

  get define () {
    return {
      foo: 'string'
    }
  }
};

class Bar extends DefineObject {
  static get define() {
    return {
      name: 'string',
      items: {
        Type: List,
        default: () => []
      },
      list: {
        Type: List,
        Default: List
      }
    };
  }
};

class CustomScroll extends StacheDefineElement {
  static get view() {
    return ``;
  }

  static get define() {
    return {
      scrolled: 'boolean',
      elem: 'string',
      something: {
        type: 'string',
        get (lastSet, resolve) {
          resolve(true);
        }
      }
    };
  }
};

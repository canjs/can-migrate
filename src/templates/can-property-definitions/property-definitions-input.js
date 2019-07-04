import { stache } from 'can/core';
import { DefineArray } from 'can/everything';
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

import { DefineObject } from 'can';
class Bar extends DefineObject {
  static get define() {
    return {
      name: 'string',
      items: {
        serialize: false,
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

class Baz extends DefineObject {
  static get define() {
    return {
      name: {
        default: () => {
          return () => {
            return 'Hello';
          }
        }
      },
      items: {
        enumerable: false,
        type: List,
        default () {
          return function () {
            return 'World!'
          }
        }
      },
      list: {
        type: List,
        default: List
      }
    };
  }
};

class MyApp extends DefineObject {
  static get define() {
    return {
      messagesPromise: {
        default(){
          return Message.getList({});
        }
      }
    };
  }
};
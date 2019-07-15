import { stache } from 'can/core';
import { DefineArray, type } from 'can';
class Foo extends DefineArray {
  static get define() {
    return {
      name: type.maybeConvert(String),
      date: type.maybeConvert(Date),
      success: type.maybeConvert(Boolean),
      completed: {
        type: 'boolean',
        default: false
      },
      items: type.Any
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

import { StacheDefineElement, type } from 'can';
class CustomScroll extends StacheDefineElement {
  static get view() {
    return ``;
  }

  static get define() {
    return {
      scrolled: type.maybeConvert(Boolean),
      elem: type.maybeConvert(MyMap),
      something: {
        type: 'string',
        get (lastSet, resolve) {
          resolve(true);
        }
      }
    };
  }
};

class MyList extends DefineArray {
  static get define() {
    return {
      '#': type.maybeConvert(String),

      get itemCount () {
        return this.items;
      }
    };
  }
};

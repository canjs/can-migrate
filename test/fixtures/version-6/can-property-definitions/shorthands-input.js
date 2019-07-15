import { stache } from 'can/core';
import { DefineArray } from 'can';
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

import { StacheDefineElement } from 'can';
class CustomScroll extends StacheDefineElement {
  static get view() {
    return ``;
  }

  static get define() {
    return {
      scrolled: 'boolean',
      elem: MyMap,
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
      '#': 'string',

      get itemCount () {
        return this.items;
      }
    };
  }
};

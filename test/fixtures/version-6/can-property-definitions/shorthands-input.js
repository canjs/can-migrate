import { stache } from 'can/core';
import { ObservableArray } from 'can';
class Foo extends ObservableArray {
  static get props() {
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

  get props () {
    return {
      foo: 'string'
    }
  }
};

import { StacheElement } from 'can';
class CustomScroll extends StacheElement {
  static get view() {
    return ``;
  }

  static get props() {
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

class MyList extends ObservableArray {
  static get props() {
    return {
      '#': 'string',

      get itemCount () {
        return this.items;
      }
    };
  }
};

import { stache } from 'can/core';
import { ObservableArray, type } from 'can';
class Foo extends ObservableArray {
  static get props() {
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

  get props () {
    return {
      foo: 'string'
    }
  }
};

import { StacheElement, type } from 'can';
class CustomScroll extends StacheElement {
  static get view() {
    return ``;
  }

  static get props() {
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

class MyList extends ObservableArray {
  static get props() {
    return {
      '#': type.maybeConvert(String),

      get itemCount () {
        return this.items;
      }
    };
  }
};

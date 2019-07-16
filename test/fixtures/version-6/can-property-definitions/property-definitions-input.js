import { stache } from 'can/core';
import { ObservableArray } from 'can/everything';
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

import { ObservableObject } from 'can';
class Bar extends ObservableObject {
  static get props() {
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

class CustomScroll extends StacheElement {
  static get view() {
    return ``;
  }

  static get props() {
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

class Baz extends ObservableObject {
  static get props() {
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

class MyApp extends ObservableObject {
  static get props() {
    return {
      messagesPromise: {
        default(){
          return Message.getList({});
        }
      },
      messageList: {
        default() {
          return ['message']
        }
      },
      messageFunc: {
        default () {
          const item = this.item
          return function () {
            return item
          }
        }
      }
    };
  }
};

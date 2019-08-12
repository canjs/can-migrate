import { stache } from 'can/core';
import { ObservableArray, type } from 'can/everything';
class Foo extends ObservableArray {
  static get props() {
    return {
      name: 'string',
      date: 'date',
      success: 'boolean',
      completed: {
        type: type.maybeConvert(Boolean),
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

import { ObservableObject, type } from 'can';
class Bar extends ObservableObject {
  static get props() {
    return {
      name: 'string',
      items: {
        enumerable: false,
        type: type.maybeConvert(List),

        get default() {
          return [];
        }
      },
      list: {
        type: type.maybeConvert(List),

        get default() {
          return new List();
        }
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
        type: type.maybeConvert(String),
        async (resolve, lastSet) {
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
          return 'Hello';
        }
      },
      items: {
        enumerable: false,
        type: type.maybeConvert(List),
        default () {
          return 'World!'
        }
      },
      list: {
        type: type.maybeConvert(List),
        default: List
      }
    };
  }
};

class MyApp extends ObservableObject {
  static get props() {
    return {
      messagesPromise: {
        get default() {
          return Message.getList({});
        }
      },
      messageList: {
        get default() {
          return ['message']
        }
      },
      messageFunc: {
        default () {
          const item = this.item
          return item
        }
      }
    };
  }
};

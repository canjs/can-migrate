import { stache } from 'can/core';
import { DefineArray, type } from 'can/everything';
class Foo extends DefineArray {
  static get define() {
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

  get define () {
    return {
      foo: 'string'
    }
  }
};

import { DefineObject, type } from 'can';
class Bar extends DefineObject {
  static get define() {
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

class CustomScroll extends StacheDefineElement {
  static get view() {
    return ``;
  }

  static get define() {
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

class Baz extends DefineObject {
  static get define() {
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

class MyApp extends DefineObject {
  static get define() {
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

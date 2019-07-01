class Bar extends DefineObject {
  static get define() {
    return {
      name: 'string',
      createItem(args) {
        return new Item(args);
      },
      get sayHi () {
        return `Hello ${this.name}`;
      }
    };
  }
};

class Foo extends DefineObject {
  static get define() {
    return {
      async createItem(args) {
        return new Item(args);
      }
    };
  }
};

class List extends DefineArray {
  static get define() {
    return {
      name: 'string',
      items: [],
      addItem(item) {
        this.items.push(item);
      },
      removeItem: function (index) {
        this.items.splice(index, 1);
      }
    };
  }
};

class Bar extends ObservableObject {
  static get props() {
    return {
      name: 'string',

      get sayHi () {
        return `Hello ${this.name}`;
      },

      set sayHi (val) {
        this.name = val;
      }
    };
  }

  createItem(args) {
    return new Item(args);
  }
};

class Foo extends ObservableObject {
  static get props() {
    return {};
  }

  async createItem(args) {
    return new Item(args);
  }
};

class List extends ObservableArray {
  static get props() {
    return {
      name: 'string',
      items: []
    };
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(index) {
    this.items.splice(index, 1);
  }
};

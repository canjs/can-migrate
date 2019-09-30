class Bar extends ObservableObject {
  static get props() {
    return {
      name: 'string',
      createItem(args) {
        return new Item(args);
      },
      get sayHi () {
        return `Hello ${this.name}`;
      },
      set sayHi (val) {
        this.name = val;
      }
    };
  }
};

class Foo extends ObservableObject {
  static get props() {
    return {
      // The comment should not be removed
      async createItem(args) {
        return new Item(args);
      }
    };
  }
};

class List extends ObservableArray {
  static get props() {
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

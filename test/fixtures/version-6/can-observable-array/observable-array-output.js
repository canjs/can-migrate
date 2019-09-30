/**
 * Multiline comment
 * Foo Bar
 */
class MyList extends ObservableArray {
  static get props() {
    return { '#': 'string' };
  }
}

// A comment
class MyOtherList extends ObservableArray {
  static get props() {
    return {
      '#': 'string',

      get itemCount () {
        return this.items;
      }
    };
  }
}

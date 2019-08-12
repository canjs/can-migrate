class MyList extends ObservableArray {
  static get props() {
    return { '#': 'string' };
  }
}

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

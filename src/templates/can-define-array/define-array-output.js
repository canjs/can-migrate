class MyList extends DefineArray {
  static get define() {
    return { '#': 'string' };
  }
}

class MyOtherList extends DefineArray {
  static get define() {
    return {
      '#': 'string',

      get itemCount () {
        return this.items;
      }
    };
  }
}

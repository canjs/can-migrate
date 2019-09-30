/**
 * Multiline comment
 * Foo Bar
 */
const MyList = DefineList.extend({ '#': 'string' });

// A comment
const MyOtherList = DefineList.extend({
  '#': 'string',

  get itemCount () {
    return this.items;
  }
});

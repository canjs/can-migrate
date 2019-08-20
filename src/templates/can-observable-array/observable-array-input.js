const MyList = DefineList.extend({ '#': 'string' });

const MyOtherList = DefineList.extend({
  '#': 'string',

  get itemCount () {
    return this.items;
  }
});


let ViewModel = DefineMap.extend({
  prop1: {
    value: 'prop1 value'
  },
  prop2: {
    value: 'prop2 value'
  },
  setMap: {
    value: function() {
      this.set({}, true);
    }
  }
});

let MyList = new DefineList([
  { prop1: 'prop1 value' },
  { prop2: function() {
      this.set([], true);
    }
  }
]);

let obj = {
  someProp: 'hello',
  setMap: function() {
    this.set({}, true);
  }
}


let ViewModel = DefineMap.extend({
  prop1: {
    value: 'prop1 value'
  },
  prop2: {
    value: 'prop2 value'
  },
  print: {
    value: function() {
      this.each((val) => {
        console.log(val);
      });
    }
  }
});

let MyList = new DefineList([
  { prop1: 'prop1 value' },
  { prop2: function() {
      this.each((val) => {
        console.log(val);
      });
    }
  }
]);

let obj = {
  someProp: 'hello',
  print: function() {
    this.each((val) => {
      console.log(val);
    });
  }
}

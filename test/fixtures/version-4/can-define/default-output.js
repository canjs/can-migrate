
let ViewModel = DefineMap.extend({
  myProp: {
    default: 'something'
  }
});

let obj = {
  myProp: {
    value: 'something else'
  }
}

let AnotherVM = Something.extend({
  myProp: {
    value: 'something'
  }
});

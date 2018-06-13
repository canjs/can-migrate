const Component = require('can-component');

const map = new Component({
  define: {
    Type: Component
  }
});
Component();
new Component();
Component.prototype.say = function(){};
function speak(MyComponent) {};
const say = function(MyComponent) {};
Object.assign({}, Component);
const map = new Component({
  MyComponent: Component
});

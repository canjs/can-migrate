const MyComponent = require('can/component/component');

const map = new MyComponent({
  define: {
    Type: MyComponent
  }
});
MyComponent();
new MyComponent();
MyComponent.prototype.say = function(){};
function speak(MyComponent) {};
const say = function(MyComponent) {};
Object.assign({}, MyComponent);

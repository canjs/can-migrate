const MyModel = require('can/model/model');

const map = new MyModel({
  define: {
    Type: MyModel
  }
});
MyModel();
new MyModel();
MyModel.prototype.say = function(){};
function speak(MyModel) {};
const say = function(MyModel) {};
Object.assign({}, MyModel);
const secondMap = new MyModel({
  MyModel: MyModel
});

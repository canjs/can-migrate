const MyConstruct = require('can-construct');

const map = new MyConstruct({
  define: {
    Type: MyConstruct
  }
});
MyConstruct();
new MyConstruct();
MyConstruct.prototype.say = function(){};
function speak(MyConstruct) {};
const say = function(MyConstruct) {};
Object.assign({}, MyConstruct);

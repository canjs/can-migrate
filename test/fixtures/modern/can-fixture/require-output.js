const MyFixture = require('can-fixture');

const map = new MyFixture({
  define: {
    Type: MyFixture
  }
});
MyFixture();
new MyFixture();
MyFixture.prototype.say = function(){};
function speak(MyFixture) {};
const say = function(MyFixture) {};
Object.assign({}, MyFixture);

import MyFixture from 'can/util/fixture/fixture';

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
const secondMap = new MyFixture({
  MyFixture: MyFixture
});

const fixture = require('can-fixture');

const map = new fixture({
  define: {
    Type: fixture
  }
});
fixture();
new fixture();
fixture.prototype.say = function(){};
function speak(MyFixture) {};
const say = function(MyFixture) {};
Object.assign({}, fixture);
const secondMap = new fixture({
  MyFixture: fixture
});

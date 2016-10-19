import fixture from 'can-fixture';

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

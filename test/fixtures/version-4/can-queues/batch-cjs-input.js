var canBatch = require('can-event/batch/batch');

function someFunction() {
  canBatch.start();
  var foo = 'bar';
  canBatch.stop();
}

someFunction();

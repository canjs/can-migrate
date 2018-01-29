import canBatch from 'can-event/batch/batch';

function someFunction() {
  canBatch.start();
  var foo = 'bar';
  canBatch.stop();
}

someFunction();

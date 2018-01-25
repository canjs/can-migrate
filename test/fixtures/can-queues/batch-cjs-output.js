var queues = require('can-queues');

function someFunction() {
  queues.batch.start();
  var foo = 'bar';
  queues.batch.stop();
}

someFunction();
